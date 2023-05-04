grammar JstoPython;

/*
 * Parser Rules
 */
start: methodDeclarations? EOF;
methodDeclarations: methodDeclaration+ ;
methodDeclaration: methodHeader methodBody ;
methodHeader: 'function' methodName '(' ')';
methodBody: '{' statement* '}';
statement: embeddedStatement ';';
embeddedStatement: localVariableDeclaration | methodCall;
localVariableDeclaration: variableType variableName ('=' variableValue)? ;
methodCall: methodName '(' ')';
methodName: WORD;
variableType: 'let' | 'var' | 'const';
variableName: WORD;
variableValue: INT | BOOLEAN | STRING;

 /*
 * Lexer Rules
 */
fragment LOWERCASE: [a-z] ;
fragment UPPERCASE: [A-Z] ;
INT: '-'? [0-9]+;
BOOLEAN: 'true' | 'false';
STRING: '"' .*? '"' ;
WORD: [a-zA-Z_] [a-zA-Z0-9_]* ;
WHITESPACE : (' '|'\t')+ -> skip ;
NEWLINE: ('\r'? '\n' | '\r')+ -> skip;