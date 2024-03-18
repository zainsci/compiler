const TokenType = {
	LITERAL: "LITERAL",
	IDENTIFIER: "IDENTIFIER",
	KEYWORD: "KEYWORD",
	COMMENT: "COMMENT",

	PLUS: "PLUS",
	MINUS: "MINUS",
	MULTIPLY: "MULTIPLY",
	DIVIDE: "DIVIDE",
	ASSIGN: "ASSIGN",

	L_PAREN: "L_PAREN",
	R_PAREN: "R_PAREN",
	L_BRACE: "L_BRACE",
	R_BRACE: "R_BRACE",
} as const

const Keywords = {
	CONST: "const",
	LET: "let",
	FUNCTION: "func",
}

interface Token {
	type: keyof typeof TokenType
	lexeme: string
	line: number
}

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const numeric = "0123456789"

class Lexer {
	source: string
	current: number
	line: number
	tokens: Array<Token> = []

	constructor(source: string) {
		this.source = source
		this.current = 0
		this.line = 1
	}

	makeToken(type: keyof typeof TokenType, lexeme: string | null = null) {
		if (lexeme !== null) {
			this.tokens.push({
				type,
				lexeme,
				line: this.line,
			})
		} else
			this.tokens.push({
				type,
				lexeme: this.source[this.current],
				line: this.line,
			})
	}

	peek() {
		return this.source[this.current + 1]
	}

	isAlpha() {
		return alpha.includes(this.source[this.current])
	}

	isNumeric() {
		return numeric.includes(this.source[this.current])
	}

	scanTokens() {
		while (this.current <= this.source.length) {
			if (this.source[this.current] === "\n") this.line++

			if (this.isAlpha()) {
				const start = this.current
				this.current++
				while (
					this.source[this.current] !== " " &&
					this.source[this.current] !== "\n" &&
					this.current <= this.source.length
				)
					this.current++

				const thisIden = this.source.substring(start, this.current)

				switch (thisIden) {
					case Keywords.CONST:
						this.makeToken(TokenType.KEYWORD, thisIden)
						break
					case Keywords.LET:
						this.makeToken(TokenType.KEYWORD, thisIden)
						break
					case Keywords.FUNCTION:
						this.makeToken(TokenType.KEYWORD, thisIden)
						break
					default:
						this.makeToken(TokenType.IDENTIFIER, thisIden)
						break
				}
			}

			if (this.isNumeric()) {
				console.log(this.current, this.source[this.current])
				const start = this.current
				this.current++
				while (
					this.source[this.current] !== " " &&
					this.source[this.current] !== "\n" &&
					this.current <= this.source.length
				)
					this.current++

				this.makeToken(
					TokenType.LITERAL,
					this.source.substring(start, this.current)
				)
				continue
			}

			switch (this.source[this.current]) {
				case "+":
					this.makeToken(TokenType.PLUS)
					break
				case "-":
					this.makeToken(TokenType.MINUS)
					break
				case "*":
					this.makeToken(TokenType.MULTIPLY)
					break
				case "(":
					this.makeToken(TokenType.L_PAREN)
					break
				case ")":
					this.makeToken(TokenType.R_PAREN)
				case "{":
					this.makeToken(TokenType.L_BRACE)
					break
				case "}":
					this.makeToken(TokenType.R_BRACE)
					break
				case "=":
					this.makeToken(TokenType.ASSIGN)
					break

				case "/": {
					if (this.peek() === "/") {
						const start = this.current

						while (
							this.source[this.current] !== "\n" &&
							this.current <= this.source.length
						)
							this.current++

						this.makeToken(
							TokenType.COMMENT,
							this.source.substring(start, this.current++)
						)

						break
					} else {
						this.makeToken(TokenType.DIVIDE)
						break
					}
				}

				case "'": {
					const start = this.current
					this.current++
					while (this.source[this.current] !== "'") this.current++
					this.current++

					this.makeToken(
						TokenType.LITERAL,
						this.source.substring(start, this.current)
					)

					break
				}

				case '"': {
					const start = this.current
					this.current++
					while (this.source[this.current] !== '"') this.current++
					this.current++

					this.makeToken(
						TokenType.LITERAL,
						this.source.substring(start, this.current)
					)

					break
				}
			}

			this.current++
		}
	}
}

function main() {
	const sourceCode = `let a = 1 + 2
  const b = "three"
  // this is a comment
  func () {}`
	const lexer = new Lexer(sourceCode)
	lexer.scanTokens()
	lexer.tokens.forEach((token) => console.log(token))
}
main()
