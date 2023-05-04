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
        let pythonConditionHeader = `${ctx.conditionHeader().getText()}:`;
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

    visitConditionElse(ctx){
        let pythonConditionElse = getIndentation(this.contextLevel) + 'else:\n';
        this.contextLevel += 1;
        pythonConditionElse += this.visit(ctx.methodBody());
        this.contextLevel -= 1;
        return pythonConditionElse;
    }

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
fs.writeFileSync("result.py", python_code)
