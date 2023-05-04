grammar JstoPython;

/*
 * Parser Rules
 */
start: methodDeclarations? EOF;
methodDeclarations: methodDeclaration+ ;
methodDeclaration: methodHeader methodBody ;
methodHeader: 'function' methodName '('methodDeclarationArguments?')';
methodDeclarationArguments: WORD (',' WORD)*;
methodBody: '{' statement* '}';
statement: embeddedStatement EOL? commentText?;
embeddedStatement:
    localVariableDeclaration
    | variableOperation 
    | condition
    | commentText
    | methodCall;
localVariableDeclaration: variableType variableName (EQ variableValue)? ;
condition: conditionHeader methodBody conditionElse?;
conditionHeader: IF '('(WORD | INT) COMPAREOPERATION (WORD | INT)')';
conditionElse: ELSE methodBody;
methodCall: methodName '('methodCallAgruments')';
methodCallAgruments: (WORD | INT) (',' (WORD | INT))*;
commentText: COMMENT;
methodName: WORD;
variableType: 'let' | 'var' | 'const';
variableName: WORD;
variableValue: INT | BOOLEAN | STRING;
variableOperation: leftOperationSide rightOperationSide;
leftOperationSide: WORD (EQOPS | EQ);
rightOperationSide: (INT | '-'? WORD) (MATHOPERATION (WORD | INT))*;

 /*
 * Lexer Rules
 */

IF: 'if';
ELSE: 'else';
EQ: '=';
EQOPS: PLUSEQ | MINUSEQ | MULTEQ | DIVEQ | REMAINDEREQ;
INT: '-'? [0-9]+;
BOOLEAN: 'true' | 'false';
STRING: '"' .*? '"' ;
WORD: [a-zA-Z_] [a-zA-Z0-9_]* ;
WHITESPACE : (' '|'\t')+ -> skip ;
NEWLINE: ('\r'? '\n' | '\r')+ -> skip;
COMMENT: '//' ~[\r\n\f]* ;
EOL: ';';
MATHOPERATION: PLUS | MINUS | MULT | POWER | DIV | INTDIV | REMAINDER;
COMPAREOPERATION: EQUALITY | STREQUALITY | INEQUALITY | STRINEQUALITY | LESS | LARGER | LESSOREQ | MOREOREQ;
fragment PLUS: '+';
fragment MINUS: '-';
fragment MULT: '*';
fragment POWER: '**';
fragment DIV: '/';
fragment INTDIV: '//';
fragment REMAINDER: '%';
fragment PLUSEQ: '+=';
fragment MINUSEQ: '-=';
fragment MULTEQ: '*=';
fragment DIVEQ: '/=';
fragment REMAINDEREQ: '%=';
fragment EQUALITY: '==';
fragment STREQUALITY: '==='; //!
fragment INEQUALITY: '!=';
fragment STRINEQUALITY: '!=='; //!
fragment LESS: '<';
fragment LARGER: '>';
fragment LESSOREQ: '<=';
fragment MOREOREQ: '>=';
