import antlr4, { CommonTokenStream, FileStream, InputStream } from 'antlr4';
import JstoPythonLexer from './JstoPythonLexer.js';
import JstoPythonParser from './JstoPythonParser.js';
import JstoPythonVisitor from './JstoPythonVisitor.js';
import * as fs from 'fs';


function getIndentation(contextLevel){
    return " ".repeat(4 * contextLevel);
}

class Visitor extends JstoPythonVisitor{

    constructor(){
        super();
        this.contextLevel = 0;
    };

    visitStart(ctx){
        return this.visit(ctx.methodDeclarations())
    }

    visitMethodDeclarations(ctx){
        let pythonMethods = [];
        for (let methodNum=0; methodNum < ctx.methodDeclaration().length; methodNum += 1){
            pythonMethods.push(this.visit(ctx.methodDeclaration()[methodNum]));
            if (pythonMethods[pythonMethods.length - 1].slice(-1) == ',') {
                pythonMethods[pythonMethods.length - 1] = pythonMethods[pythonMethods.length - 1].slice(0, -1);
            }
        }
        return pythonMethods.join("\n");
    }

    visitMethodDeclaration(ctx){
        let header = ctx.methodHeader();
        let pythonMethodHeader = getIndentation(this.contextLevel) + this.visit(header);
        this.contextLevel += 1;
        let body = ctx.methodBody();
        let pythonMethodBody = this.visit(body);
        this.contextLevel -= 1;
        return `${pythonMethodHeader}\n${pythonMethodBody}`;
    };
    
    visitMethodBody(ctx){
        let pythonLines = [];
        for (let statementNum = 0; statementNum < ctx.statement().length; statementNum += 1){
            pythonLines.push(getIndentation(this.contextLevel) + this.visit(ctx.statement()[statementNum]));
            if (pythonLines[pythonLines.length - 1].slice(-1) == ',') {
                pythonLines[pythonLines.length - 1] = pythonLines[pythonLines.length - 1].slice(0, -1);
            }
        }
        return pythonLines.join("\n");
    };

    visitStatement(ctx){
        let python_comments = "";
        if (ctx.commentText()){
            python_comments = this.visit(ctx.commentText());
        }
        return this.visit(ctx.embeddedStatement()) + " " + python_comments;
    };

    visitLocalVariableDeclaration(ctx){
        let varName = ctx.variableName().getText();
        let vartype = ctx.variableType().getText();
        let varValue = ctx.variableValue();

        let result = `${varName} `;

        if (varValue != null){
            if (varValue.getText() == 'true'){
                result += `= True`;
            }
            else{
                if (varValue.getText() == 'false'){
                    result += `= False`;
                }
                else{
                    result += `= ${varValue.getText()}`;
                };
            };
        };

        return result;
    };

    visitMethodCall(ctx){
        let methodName = ctx.methodName().getText();
        if (ctx.methodCallAgruments){
            let pythonMethodCallArguments = ctx.methodCallAgruments().getText();
            return `${methodName.toLowerCase()}(${pythonMethodCallArguments})`;
        }
        else{
            return `${methodName.toLowerCase()}()`;
        };
    };

    visitMethodHeader(ctx){
        if (ctx.methodDeclarationArguments()){
            let pythonMethodDecArgs = ctx.methodDeclarationArguments().getText();
            return `def ${ctx.methodName().getText().toLowerCase()}(${pythonMethodDecArgs}):`;
        }
        else{
            return `def ${ctx.methodName().getText().toLowerCase()}():`;
        };
    };

    visitCommentText(ctx){
        return '# ' + ctx.getText().slice(2);
    };

    visitCondition(ctx){
        let pythonConditionHeader = this.visit(ctx.conditionHeader());
        this.contextLevel += 1;
        let pythonConditionBody = this.visit(ctx.methodBody());
        this.contextLevel -= 1;
        if (ctx.conditionElse()){
            let pythonConditionElse = this.visit(ctx.conditionElse())
            return `${pythonConditionHeader}\n${pythonConditionBody}\n${pythonConditionElse}`;
        }
        else{
            return `${pythonConditionHeader}\n${pythonConditionBody}`;
        };
    };

    visitConditionHeader(ctx){
        let pythonCompareRule = ctx.conditionRule().getText();
        if (pythonCompareRule == '==='){
            pythonCompareRule = '==';
        };
        if (pythonCompareRule == '!=='){
            pythonCompareRule = "!=";
        };
        return `${ctx.conditionHeaderLeft().getText()} ${pythonCompareRule} ${ctx.conditionHeaderRight().getText()}:`
    };

    visitConditionElse(ctx){
        let pythonConditionElse = getIndentation(this.contextLevel) + 'else:\n';
        this.contextLevel += 1;
        pythonConditionElse += this.visit(ctx.methodBody());
        this.contextLevel -= 1;
        return pythonConditionElse;
    };

    visitWhileCycle(ctx){
        let pythonWhileCycleRule = this.visit(ctx.forCycleRule());
        this.contextLevel += 1;
        let pythonWhileCycleBody = this.visit(ctx.methodBody());
        this.contextLevel -=1;
        return `while (${pythonWhileCycleRule}):\n${pythonWhileCycleBody}`;
    };

    visitForCycle(ctx){
        let pythonForCycleHeader = "";
        let pythonLastOperation = "";
        let header = []
        header = this.visit(ctx.forCycleHeader());
        pythonForCycleHeader = header[0];
        pythonLastOperation = header[1];
        this.contextLevel += 1;
        let pythonForCycleBody = this.visit(ctx.methodBody());
        pythonForCycleBody += `\n${getIndentation(this.contextLevel) + pythonLastOperation}`;
        this.contextLevel -= 1;
        return `${pythonForCycleHeader}\n${pythonForCycleBody}`;
    };

    visitForCycleHeader(ctx){
        let pythonVariableDeclaration = "";
        if (ctx.localVariableDeclaration()){
            pythonVariableDeclaration = this.visit(ctx.localVariableDeclaration());
        };
        let pythonForCycleRule = "";
        if (ctx.forCycleRule()){
            pythonForCycleRule = this.visit(ctx.forCycleRule());
        };
        let pythonVariableOperation = "";
        if (ctx.variableOperation()){
            pythonVariableOperation = this.visit(ctx.variableOperation());
        };
        return [`${pythonVariableDeclaration}\n${getIndentation(this.contextLevel)}while (${pythonForCycleRule}):`, pythonVariableOperation];
    };

    visitForCycleRule(ctx){
        let pythonForCycleRulePart1 = ctx.forCycleRulePart()[0].getText();
        let pythonForCycleRulePart2 = ctx.forCycleRulePart()[1].getText();
        let pythonForCycleRuleOperation = ctx.forCycleRuleOperation().getText();
        if (pythonForCycleRuleOperation == '==='){
            pythonForCycleRuleOperation = '==';
        };
        if (pythonForCycleRuleOperation == '!=='){
            pythonForCycleRuleOperation = '!=';
        };
        return `${pythonForCycleRulePart1}${pythonForCycleRuleOperation}${pythonForCycleRulePart2}`;
    };

    visitCycleReservedWord(ctx){
        return ctx.getText();
    };

    visitVariableOperation(ctx){
        let pythonOperationLeft = ctx.leftOperationSide().getText();
        let pythonOperationRight = ctx.rightOperationSide().getText();
        return pythonOperationLeft + pythonOperationRight;
    };
};



var code = new FileStream("code.txt");
// var inputstream = new InputStream(code)
var lexer = new JstoPythonLexer(code);
var stream = new CommonTokenStream(lexer);
var parser = new JstoPythonParser(stream);
var startContext = parser.start();
var visitor = new Visitor();
var python_code = visitor.visit(startContext);
console.log(python_code)
fs.writeFileSync("result.py", python_code);
