const URL = 'http://localhost:5000';

var casas = document.getElementsByTagName('input');
const b_reiniciar = document.getElementById('reiniciar'); 
const label_jogador = document.getElementById('jogador'); 

label_jogador.innerText="O";
label_jogador.style.color='#ffffff';

var jogador = 'O';
var vencedor = '-';
var finish;

var getTabuleiroAtual = function(reiniciar) {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": URL + '/atual',
        "method": "GET",
        "cache": false,
        "processData": false,
        "contentType": false,
        "data": ''
    }

    $.ajax(settings)
        .done(function (response) {
            console.log(response);
            var array = [];
            for (var i = 0; i < response.length; i++) {
                for (var j = 0; j < response[i].length; j++) {
                    array.push(response[i][j]);
                }
            }
            console.log("ola array: " + array)

            for (var i = 0; i < array.length; i++) {
                if (array[i] === 'X' && casas[i].value != array[i]) {
//                    $(casas[i]).click();
                    casas[i].value="X";
                    casas[i].style.color='#bc5e00';
                }

            }



            trocarJogador();
            vencedor = vitoria();
        })
        .fail(function (response) {
            console.log(response);
        });
}

var enviarJogada = function(coluna, linha) {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": URL + '/enviar',
        "method": "POST",
        "cache": false,
        "processData": false,
        "contentType": "application/json",
        "data": `{"coluna": ${coluna}, "linha": ${linha}}`
    }

    $.ajax(settings)
        .done(function (response) {
            console.log(response);
            getTabuleiroAtual();
        })
        .fail(function (response) {
            console.log(response);
        });
}

var reiniciar = function() {
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": URL + '/reiniciar',
        "method": "GET",
        "cache": false,
        "processData": false,
        "contentType": false,
        "data": ''
    }

    $.ajax(settings)
        .done(function (response) {
            console.log(response);
            var array = [];
            for (var i = 0; i < response.length; i++) {
                for (var j = 0; j < response[i].length; j++) {
                    array.push(response[i][j]);
                }
            }

            for (var i = 0; i < array.length; i++) {
                if (array[i] === 'X' && casas[i].value != array[i]) {
                    casas[i].value="X";
                    casas[i].style.color='#bc5e00';
                }
            }
            jogador = 'O';
        })
        .fail(function (response) {
            console.log(response);
        });
}
reiniciar();
for(var i=0;i<9;i++) {
    casas[i].style.color='#F9F9F9';
	casas[i].addEventListener('click', (event) => {
		if( (event.target.value=='-') && (vencedor=='-')) {
			event.target.value=jogador;
			event.target.style.color='#bc5e00';

            var i = parseInt(event.target.id);

			var coluna = 0;;
			var linha = 0;

			if (i === 0) {
			    coluna = 0
			    linha = 0
			}
			if (i === 1) {
			    coluna = 1
			    linha = 0
			}
			if (i === 2) {
			    coluna = 2
			    linha = 0
			}
			if (i === 3) {
			    coluna = 0
			    linha = 1
			}
			if (i === 4) {
			    coluna = 1
			    linha = 1
			}
			if (i === 5) {
			    coluna = 2
			    linha = 1
			}
			if (i === 6) {
			    coluna = 0
			    linha = 2
			}
			if (i === 7) {
			    coluna = 1
			    linha = 2
			}
			if (i === 8) {
			    coluna = 2
			    linha = 2
			}
			enviarJogada(coluna, linha);
			trocarJogador();

		}
	});
}

b_reiniciar.addEventListener('click', (event) => {
	for(var i=0;i<9;i++) {
		casas[i].value='-';
		casas[i].style.color='#F9F9F9';
		casas[i].style.backgroundColor='#F9F9F9';
	}
	vencedor = '-';
	reiniciar();
});

var trocarJogador = function() {
	if(jogador=='X') {
		jogador='O';
		label_jogador.innerText='O';
		label_jogador.style.color='#ffffff';
		
	}else{
		jogador='X';
		label_jogador.innerText='X';
		label_jogador.style.color='#000000';
	}
}

var vitoria = function() {
	if((casas[0].value==casas[1].value) && (casas[1].value==casas[2].value) && casas[0].value!='-' ) {
		casas[0].style.backgroundColor='#0F0';
		casas[1].style.backgroundColor='#0F0';
		casas[2].style.backgroundColor='#0F0';

		return casas[0].value;

	} else if((casas[3].value==casas[4].value) && (casas[4].value==casas[5].value) && casas[3].value!='-' ) {
		casas[3].style.backgroundColor='#0F0';
		casas[4].style.backgroundColor='#0F0';
		casas[5].style.backgroundColor='#0F0';

		return casas[3].value;

	} else if((casas[6].value==casas[7].value) && (casas[7].value==casas[8].value) && casas[6].value!='-' ) {
		casas[6].style.backgroundColor='#0F0';
		casas[7].style.backgroundColor='#0F0';
		casas[8].style.backgroundColor='#0F0';

		return casas[6].value;

	} else if((casas[0].value==casas[3].value) && (casas[3].value==casas[6].value) && casas[0].value!='-' ) {
		casas[0].style.backgroundColor='#0F0';
		casas[3].style.backgroundColor='#0F0';
		casas[6].style.backgroundColor='#0F0';

		return casas[0].value;

	} else if((casas[1].value==casas[4].value) && (casas[4].value==casas[7].value) && casas[1].value!='-' ) {
		casas[1].style.backgroundColor='#0F0';
		casas[4].style.backgroundColor='#0F0';
		casas[7].style.backgroundColor='#0F0';

		return casas[1].value;

	} else if((casas[2].value==casas[5].value) && (casas[5].value==casas[8].value) && casas[2].value!='-' ) {
		casas[2].style.backgroundColor='#0F0';
		casas[5].style.backgroundColor='#0F0';
		casas[8].style.backgroundColor='#0F0';

		return casas[2].value;
	} else if((casas[0].value==casas[4].value) && (casas[4].value==casas[8].value) && casas[0].value!='-' ) {
		casas[0].style.backgroundColor='#0F0';
		casas[4].style.backgroundColor='#0F0';
		casas[8].style.backgroundColor='#0F0';

		return casas[0].value;

	} else if((casas[2].value==casas[4].value) && (casas[4].value==casas[6].value) && casas[2].value!='-' ) {
		casas[2].style.backgroundColor='#0F0';
		casas[4].style.backgroundColor='#0F0';
		casas[6].style.backgroundColor='#0F0';

		return casas[2].value;
	}
								
    return '-';
}

