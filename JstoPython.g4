grammar JstoPython;

/*
 * Parser Rules
 */
start: methodDeclarations? EOF;
methodDeclarations: methodDeclaration+ ;
methodDeclaration: methodHeader methodBody ;
methodHeader: 'function' methodName '(' ')';
methodBody: '{' statement* '}';
statement: embeddedStatement EOL? commentText?;
embeddedStatement:
    localVariableDeclaration
    | variableOperation 
    | condition
    | commentText
    | methodCall;
localVariableDeclaration: variableType variableName (EQ variableValue)? ;
condition: conditionHeader methodBody;
conditionHeader: IF '(' ')';
methodCall: methodName '(' ')';
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
EQ: '=';
EQOPS: '+='|'-='|'*='|'/='|'%=';
INT: '-'? [0-9]+;
BOOLEAN: 'true' | 'false';
STRING: '"' .*? '"' ;
WORD: [a-zA-Z_] [a-zA-Z0-9_]* ;
WHITESPACE : (' '|'\t')+ -> skip ;
NEWLINE: ('\r'? '\n' | '\r')+ -> skip;
COMMENT: '//' ~[\r\n\f]* ;
EOL: ';';
MATHOPERATION: PLUS | MINUS | MULT | POWER | DIV | INTDIV | REMAINDER;
fragment PLUS: '+';
fragment MINUS: '-';
fragment MULT: '*';
fragment POWER: '**';
fragment DIV: '/';
fragment INTDIV: '//';
fragment REMAINDER: '%';