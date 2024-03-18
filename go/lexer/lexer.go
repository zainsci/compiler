package lexer

type TokenType int

type Token struct {
	Type   TokenType
	Lexeme string
	Line   int
}

const (
	TokenTypeString
	TokenTypeNumber
	TokenTypeIdentifier
	TokenTypeKeyword
	TokenTypeOperator
	TokenTypePlus
	TokenTypeMinus
	TokenTypeMultiply
	TokenTypeDivide
	TokenTypeAssign
)

type Lexer struct {
	Source  string
	Tokens  []Token
	Start   int
	Current int
	Line    int
}

func NewLexer(source string) *Lexer {
	return &Lexer{
		Source:  source,
		Tokens:  make([]Token, 0),
		Start:   0,
		Current: 0,
		Line:    1,
	}
}

// Scan Tokens
func (l *Lexer) ScanTokens() []Token {
	return l.Tokens
}

// Check if its the end of the source code
func isEnd(l *Lexer) bool {
	return l.Current >= len(l.Source)
}

// Add Tokens to l.Tokens
func (l *Lexer) addToken(tokenType TokenType) {
	lexeme := l.Source[l.Start:l.Current]
	l.Tokens = append(l.Tokens, Token{tokenType, lexeme, l.Line})
}

// Get the next char in the source code
func (l *Lexer) advance() rune {
	l.Current++
	return rune(l.Source[l.Current-1])
}

// Peek at the current char
func (l *Lexer) peek() rune {
	if isEnd(l) {
		return rune(0)
	}
	return rune(l.Source[l.Current])
}

// Check if the current char matches the expected char
func (l *Lexer) match(expected rune) bool {
	if isEnd(l) {
		return false
	}
	if rune(l.Source[l.Current]) != expected {
		return false
	}
	l.Current++
	return true
}

// Peek at the Next char than the current one
func (l *Lexer) peekNext() rune {
	if l.Current+1 >= len(l.Source) {
		return rune(0)
	}
	return rune(l.Source[l.Current+1])
}

// Skip Whitespace
func (l *Lexer) skipWhiteSpace() {
	for !isEnd(l) {
		c := l.advance()
		if c == '\n' {
			l.Line++
		}
	}
}
