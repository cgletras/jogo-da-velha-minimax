from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

class JogoDaVelha:
    def __init__(self):
        """
        Inicializa as variáveis da classe
        """
        self.opcaoDoJogador = "O"
        self.opcaoDaMaquina = "X"
        self.vazio = "-"
        self.tabuleiro = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]

    def verificaVencedor(self, tabuleiro=None):
        """
        Verifica quem é o vencedor em um dado tabuleiro
        :param tabuleiro:
        :return: X, O ou Nenhum
        """
        if (tabuleiro == None):
            tabuleiro = self.tabuleiro
        for v in range(len(tabuleiro)):
            if (tabuleiro[v][0] == tabuleiro[v][1] == tabuleiro[v][2] and tabuleiro[v][0] != "-"):
                """
                    Verifica combinações na vertical e retorna quem ganhou.
                """
                return str(tabuleiro[v][0])
        for h in range(len(tabuleiro[0])):
            if (tabuleiro[0][h] == tabuleiro[1][h] == tabuleiro[2][h] and tabuleiro[0][h] != "-"):
                """
                    Verifica combinações na horizontal e retorna quem ganhou.
                """
                return str(tabuleiro[0][h])
        if (tabuleiro[0][0] == tabuleiro[1][1] == tabuleiro[2][2] and tabuleiro[0][0] != "-"):
            """
                Verifica combinações na diagonal esquerda para direita e retorna quem ganhou.
            """
            return str(tabuleiro[0][0])
        if (tabuleiro[2][0] == tabuleiro[1][1] == tabuleiro[0][2] and tabuleiro[2][0] != "-"):
            """
                Verifica combinações na diagonal direita para esquerda e retorna quem ganhou.
            """
            return str(tabuleiro[2][0])
        for y in range(len(tabuleiro)):
            for x in range(len(tabuleiro[y])):
                if (tabuleiro[y][x] == "-"):
                    """
                        Verifica se o tabuleiro ainda está vazio
                    """
                    return self.vazio
        """
            Se chegar até aqui, ninguém ganhou
        """
        return 'Nenhum'

    def marcar(self, coluna, linha, player=None):
        """
        Marca uma opção dentro do tabuleiro
        :param coluna: Coluna, pode ir de 0 a 2.
        :param linha: Linha, pode ir de 0 a 2.
        :param player: Pode ser X ou O, caso seja omitido, entende-se que é uma opção do jogador
        """
        if (player == None):
            player = self.opcaoDoJogador
        coluna = coluna
        linha = linha
        self.tabuleiro[linha][coluna] = player

    def reiniciarJogo(self):
        """
        Método utilizado para reiniciar o tabuleiro para o estado inicial
        """
        self.tabuleiro = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]
        jogoDaVelha.marcar(1, 1, "X")

    def getCasasVazias(self, board=None):
        """
        Devolve uma lista que contém as coordenadas de casas que ainda podem ser marcadas
        :param board:
        :return: Lista de casas que ainda podem ser marcadas.
        """
        if (board == None):
            board = self.tabuleiro
        empty = []
        for y in range(len(board)):
            for x in range(len(board[y])):
                if (board[y][x] == "-"):
                    empty.append([x, y])
        return empty

    def ehUmaCasaDisponivel(self, coluna, linha):
        """
        Verifica se a opção desejada está diponível para marcação
        :param coluna: Coluna, pode ir de 0 a 2.
        :param linha: Linha, pode ir de 0 a 2.
        :return: Booleano informando se a casa está disponível.
        """
        if ([coluna, linha] in self.getCasasVazias()):
            return True
        else:
            return False

    def minimax(self, isComp, tabuleiro=None):
        """
        Algorítimo recursivo de árvore que busca a melhor forma
        :param isComp:
        :param tabuleiro:
        :return:
        """
        if (tabuleiro == None):
            tabuleiro = self.tabuleiro
        statusDoJogo = self.verificaVencedor(tabuleiro)
        if (statusDoJogo == self.opcaoDaMaquina):
            return [1, None]
        elif (statusDoJogo == self.opcaoDoJogador):
            return [-1, None]
        elif (statusDoJogo == 'Nenhum'):
            return [0, None]
        elif isComp:
            best = [-2, None]
            for i in self.getCasasVazias():
                tabuleiro[i[1]][i[0]] = self.opcaoDaMaquina
                value = self.minimax(False, tabuleiro)[0]
                if (value > best[0]):
                    best = [value, [i[1], i[0]]]
                tabuleiro[i[1]][i[0]] = self.vazio
            return best
        else:
            best = [+2, None]
            for i in self.getCasasVazias():
                tabuleiro[i[1]][i[0]] = self.opcaoDoJogador
                value = self.minimax(True, tabuleiro)[0]
                if (value < best[0]):
                    best = [value, [i[1], i[0]]]
                tabuleiro[i[1]][i[0]] = self.vazio
            return best


jogoDaVelha = JogoDaVelha()
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    jogoDaVelha.reiniciarJogo()
    return app.send_static_file('index.html')

@app.route('/atual', methods=['GET'])
def atual():
    return jsonify(jogoDaVelha.tabuleiro)

@app.route('/reiniciar', methods=['GET'])
def reiniciar():
    jogoDaVelha.reiniciarJogo()
    return jsonify(jogoDaVelha.tabuleiro)

@app.route('/vencedor', methods=['GET'])
def vencedor():
    return jogoDaVelha.verificaVencedor()

@app.route('/enviar', methods=['POST'])
def enviar():
    data = request.json
    if (jogoDaVelha.ehUmaCasaDisponivel(data['coluna'], data['linha']) == True):
        jogoDaVelha.marcar(data['coluna'], data['linha'], 'O')
        jogoDaVelha.marcar(jogoDaVelha.minimax(True)[1][1], jogoDaVelha.minimax(True)[1][0], jogoDaVelha.opcaoDaMaquina)

    return jsonify(jogoDaVelha.verificaVencedor())

if __name__ == "__main__":
    app.run()
