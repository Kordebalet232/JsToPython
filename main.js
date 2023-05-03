import antlr4, { CommonTokenStream, InputStream } from 'antlr4';
import JstoPythonLexer from './JstoPythonLexer.js';
import JstoPythonParser from './JstoPythonParser.js';
import JstoPythonVisitor from './JstoPythonVisitor.js';

class Visitor extends JstoPythonVisitor{
    visitLine(ctx){
        let name = ctx.name()
        let opinion = ctx.opinion()
        console.log(name.getText(), opinion.getText())
        return null
    }
}




var code = "Bob says \"hello!\" \r\n Alice says \"hi!\" \r\n"
var stream = new InputStream(code)
var lexer = new JstoPythonLexer(stream)
var stream = new CommonTokenStream(lexer)
var parser = new JstoPythonParser(stream)
var chatCtx = parser.chat()
var visitor = new Visitor()
var python_code = visitor.visit(chatCtx)
console.log(python_code)
