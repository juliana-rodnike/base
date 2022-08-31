const JSPadrao = (function () {

	return Object.freeze({
		nulo
		, adicionaErro
		, removeErro
		, validaCNPJ
		, validaCPF
		, validaEmail
		, validaPIS
		, somaDiasCorridos
		, somaDiasUteis
		, getDiferencaEntreDatas
		, getDiferencaEntreDataConfig
		, validaDataFinalDeSemana
		, validaDataMaiorQueAtual
		, validaDataMenorQueAtual
		, validaHora
		, calculaIdade
		, somaValorGrid
		, validaPreenchimentoMinimoItensGRID
		, validaPreenchimentoMinimoItensGRIDSobDemanda
		, validaPreenchimentoMinimoItensGridValidaCamposGrid
		, validaCamposGrid
		, limparOpcoesCampoLista
		, adicionaOpcoesCampoLista
		, validarExtensaoArquivo
		, validarTamanhoArquivo
		, getDataFormatada
		, converteDataBrEmDate
	});

/**
 * Função que retorna valor do campo, caso seja válido.
 * Caso não seja, retorna <retorno>
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 	}
 * @param retorno <string>
 */
function nulo(config, retorno) {
	if (!config || !config.campo) {
		return "";
	}

	var grid = config.grid || "";
	var campo = config.campo;

	var oCampo;
	try {
		if (grid != "") {
			oCampo = Form.grids(grid).fields(campo);
		} else {
			oCampo = Form.fields(campo);
		}
	} catch (e) {
		oCampo = null;
	}

	if (oCampo) {
		try {
			if (oCampo.value() == undefined) {
				return retorno;
			}

			if (oCampo.value() instanceof Array) {
				if (oCampo.value()[0] == undefined) {
					return retorno;
				}

				if (isNaN(oCampo.value()[0])) {
					return oCampo.value()[0].trim();
				} else {
					return oCampo.value()[0];
				}
			} else {
				if (isNaN(oCampo.value())) {
					return oCampo.value().trim();
				} else {
					return oCampo.value();
				}
			}
		} catch (e) {
			return retorno;
		}
	} else {
		return retorno;
	}
}

/**
 * Adiciona mensagem de erro a um campo do formulário
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo (opcional)
 * 	}
 * @param mensagem <string> - mensagem a ser exibida
 * @param apply <boolean> - flag que indica se o apply deve ser chamado imediatamente (default false)
 */
function adicionaErro(config, mensagem, apply) {

	if (apply == undefined) {
		apply = false;
	}

	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var errorsForm = Form.errors();

		if (campo && campo != "") {
			errorsForm[campo] = ['' + mensagem];
		} else if (grid && grid != "") {
			errorsForm[grid] = ['' + mensagem];
		}

		Form.errors(errorsForm);

		if (apply) {
			Form.apply();
		}
	}
}

/**
 * Remove mensagens de erro de um campo do formulário
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo (opcional)
 * 	}
 * @param apply <boolean> - flag que indica se o apply deve ser chamado imediatamente (default false)
 */
function removeErro(config, apply) {

	if (apply == undefined) {
		apply = false;
	}

	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var errorsForm = Form.errors();

		if (campo && campo != "") {
			if (Form.fields(campo)) {
				Form.fields(campo).errors([]);
			}
			delete errorsForm[campo];
		} else if (grid && grid != "") {
			delete errorsForm[grid];
		}

		if (grid && grid != "" && campo && campo != "") {
			if (Form.fields(grid)) {
				if (Form.fields(campo)) {
					Form.fields(grid).fields(campo).errors([]);
				}
			}
		}

		Form.errors(errorsForm);

		if (apply) {
			Form.apply();
		}
	}
}

/**
 * Função para a validação de CNPJ
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'CNPJ inválido!')
 * 	}
 * @return <boolean> - false, caso o CNPJ seja inválido
 */
function validaCNPJ(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "CNPJ Inválido";

		if (campo && campo != "") {
			var valor = nulo(config, "");
			var erro = false;

			if (valor != "") {
				valor = valor.replace(/\./g, "");
				valor = valor.replace(/-/g, "");
				valor = valor.replace(/\//g, "");

				if (isNaN(valor)) {
					erro = true;
				} else {
					var c = valor.substr(0, 12);
					var dv = valor.substr(12, 2);
					var d1 = 0;

					for (var i = 0; i < 12; i++) {
						d1 += c.charAt(11 - i) * (2 + (i % 8));
					}

					if (d1 == 0) {
						erro = true;
					} else {

						d1 = 11 - (d1 % 11);

						if (d1 > 9) {
							d1 = 0;
						}

						if (dv.charAt(0) != d1) {
							erro = true;
						} else {
							d1 *= 2;

							for (var i = 0; i < 12; i++) {
								d1 += c.charAt(11 - i) * (2 + ((i + 1) % 8));
							}

							d1 = 11 - (d1 % 11);

							if (d1 > 9) {
								d1 = 0;
							}

							if (dv.charAt(1) != d1) {
								erro = true;
							}
						}
					}
				}
				if (erro) {
					var oCampo;

					if (grid && grid != "") {
						oCampo = Form.grids(grid).fields(campo);
					} else {
						oCampo = Form.fields(campo);
					}

					oCampo.value("");
					adicionaErro(config, mensagem, true);

					return false;
				} else {
					removeErro(config, true);
					return true;
				}
			} else {
				removeErro(config, true);
				return true;
			}
		}
	}
}

/**
 * Função para a validação de CPF
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'CPF inválido!')
 * 	}
 * @return <boolean> - false, caso o CPF seja inválido
 */
function validaCPF(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "CPF Inválido";

		if (campo && campo != "") {
			var valor = nulo(config, "");
			var erro = false;

			if (valor != "") {
				valor = valor.replace(/\./g, "");
				valor = valor.replace(/-/g, "");

				if (
					isNaN(valor) ||
					valor.length != 11 ||
					valor == '00000000000' || valor == "11111111111" || valor == "22222222222" || valor == "33333333333" ||
					valor == "44444444444" || valor == "55555555555" || valor == "66666666666" || valor == "77777777777" ||
					valor == "88888888888" || valor == "99999999999"
				) {
					erro = true;
				} else {

					var a = [];
					var b = new Number;
					var c = 11;
					var x;

					for (var i = 0; i < 11; i++) {
						a[i] = valor.charAt(i);
						if (i < 9) b += (a[i] * --c);
					}

					if ((x = b % 11) < 2) {
						a[9] = 0;
					} else {
						a[9] = 11 - x;
					}

					b = 0;
					c = 11;

					for (var y = 0; y < 10; y++) {
						b += (a[y] * c--);
					}

					if ((x = b % 11) < 2) {
						a[10] = 0;
					} else {
						a[10] = 11 - x;
					}

					if ((valor.charAt(9) != a[9]) || (valor.charAt(10) != a[10])) {
						erro = true;
					}
				}

				if (erro) {
					var oCampo;

					if (grid && grid != "") {
						oCampo = Form.grids(grid).fields(campo);
					} else {
						oCampo = Form.fields(campo);
					}

					oCampo.value("");
					adicionaErro(config, mensagem, true);

					return false;
				} else {
					removeErro(config, true);
					return true;
				}
			} else {
				removeErro(config, true);
				return true;
			}
		}
	}
}

/**
 * Função para a validação de E-mail
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'Email inválido!')
 * 	}
 * @return <boolean> - false, caso o E-mail seja inválido
 */
function validaEmail(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "Email inválido!";

		if (campo && campo != "") {
			var erro = false;
			var valor = nulo(config, "");

			if (valor != "") {
				usuario = valor.substring(0, valor.indexOf("@"));
				dominio = valor.substring(valor.indexOf("@") + 1, valor.length);

				if (
					!(
						(usuario.length >= 1)
						&& (dominio.length >= 3)
						&& (usuario.search("@") == -1)
						&& (dominio.search("@") == -1)
						&& (usuario.search(" ") == -1)
						&& (dominio.search(" ") == -1)
						&& (dominio.search(".") != -1)
						&& (dominio.indexOf(".") >= 1)
						&& (dominio.lastIndexOf(".") < dominio.length - 1)
					)
				) {
					erro = true;
				}

				if (erro) {
					var oCampo;
					if (grid && grid != "") {
						oCampo = Form.grids(grid).fields(campo);
					} else {
						oCampo = Form.fields(campo);
					}

					oCampo.value("");
					adicionaErro(config, mensagem, true);

					return false;
				} else {
					removeErro(config, true);
					return true;
				}
			} else {
				removeErro(config, true);
				return true;
			}
		}
	}
}

/**
 * Adiciona X dias à data
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, campoNovaData : <string> - identificador campo Nova data
 * 		, dias : <string> - X dias a ser adicionado a data
 * 	}
 */
function somaDiasCorridos(config) {
	if (config) {
		var dias = config.dias;
		var grid = config.grid || "";
		var campo = config.campo;
		var campoNovaData = config.campoNovaData;

		if (campo && campo != "" && dias && dias != "") {
			var data = nulo(config, "");

			// Tratamento das Variaveis.
			var dataSplitada = data.split("/");
			var d;

			if (dataSplitada.length > 1) {
				d = new Date(dataSplitada[1] + "/" + dataSplitada[0] + "/" + dataSplitada[2]);//Formato mm/dd/yyyy
			} else {
				dataSplitada = data.split("-");

				d = new Date(dataSplitada[1] + "/" + dataSplitada[2] + "/" + dataSplitada[0]);//Formato mm/dd/yyyy
			}

			Date.prototype.addDays = function (days) {
				var date = new Date(this.valueOf());
				date.setDate(date.getDate() + days);
				return date;
			}

			// Crio a var da dataFinal            
			d.setDate(d.getDate() + parseInt(dias));

			var day = d.getDate();
			var month = d.getMonth() + 1;
			var year = d.getFullYear();

			if (parseInt(day) < 10) {
				day = "0" + day;
			}

			if (parseInt(month) < 10) {
				month = "0" + month;
			}

			var dataFinal = day + "/" + month + "/" + year;

			if (campoNovaData && campoNovaData != "") {

				var oCampo;

				if (grid && grid != "") {
					oCampo = Form.grids(grid).fields(campoNovaData);
				} else {
					oCampo = Form.fields(campoNovaData);
				}

				oCampo.value(dataFinal).apply();
			}

			return dataFinal;
		}
	}
}

/**
 * Transforma data formatada como dd/MM/yyyy em um Date()
 * @param data - Valor Data preenchida no formato - dd/MM/yyyy ou ou yyyy-MM-dd
 * @returns {Date}
 */
function converteDataBrEmDate(data) {
	var retorno = null;

	var day;
	var month;
	var year;

	var dateArray = data.split("/");

	if (dateArray.length > 1) {
		day = Number(dateArray[0]);
		month = Number(dateArray[1]) - 1;
		year = Number(dateArray[2]);
	} else {
		dateArray = data.split("-");

		if (dateArray.length > 1) {
			day = Number(dateArray[2]);
			month = Number(dateArray[1]) - 1;
			year = Number(dateArray[0]);
		}
	}

	if (dateArray.length > 1) {
		var date = new Date();
		date.setFullYear(year, month, day);

		if ((date.getFullYear() == year) && (date.getMonth() == month) && (date.getDate() == day)) {
			retorno = new Date(year, month, day, 0, 0, 0);
		}
	}

	return retorno;
}

/**
 * Pega um Date() e retorna formatado como dd/MM/yyyy ou yyyy-MM-dd
 * @param date - Formata a data para ser inserida no formulário
 * @returns {String}
 */
function getDataFormatada(date) {
	var dia = date.getDate();
	dia = (dia < 10) ? ("0" + dia) : ("" + dia);

	var mes = date.getMonth() + 1;
	mes = (mes < 10) ? ("0" + mes) : ("" + mes);

	var ano = date.getFullYear();

	var dataFormatada = dia + "/" + mes + "/" + ano;

	return dataFormatada;
}

/**
 *
 * @param dataInicial - Valor Data inicial
 * @param qtdDias - Dias a somar
 * @returns {String} - Data 
 */

/**
 *  Função que soma dias a uma data desconsiderando finais de semana
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, campoNovaData : <string> - identificador campo Nova data
 * 		, dias : <string> - X dias a ser adicionado a data
 * 	}
 * return <date> - Retorna nova data
 */
function somaDiasUteis(config) {
	if (config) {
		var dias = config.dias;
		var grid = config.grid || "";
		var campo = config.campo;
		var campoNovaData = config.campoNovaData;

		var dataInicial = nulo(config, "");

		var date = converteDataBrEmDate(dataInicial);

		for (var i = 1; i <= dias; i++) {

			date.setDate(date.getDate() + 1);

			// Sábado ou Domingo - adiciona dias sem incrementar o contador
			while (date.getDay() == 0 || date.getDay() == 6) {
				date.setDate(date.getDate() + 1);
			}
		}

		var dataFormatada = getDataFormatada(date);

		if (campoNovaData && campoNovaData != "") {

			var oCampo;

			if (grid && grid != "") {
				oCampo = Form.grids(grid).fields(campoNovaData);
			} else {
				oCampo = Form.fields(campoNovaData);
			}

			oCampo.value(dataFormatada).apply();
		}

		return dataFormatada;
	}
}

/**
 * Funcao que calcula diferenca em dias entre duas datas no formato dd/MM/yyyy ou yyyy-MM-dd
 * @param dataInicial - Valor Data Inicial
 * @param dataFinal - Valor Data Final
 * @returns Retorna a diferença de dias entre uma data e outra
 */
function getDiferencaEntreDatas(dataInicial, dataFinal) {

	var datini = converteDataBrEmDate(dataInicial);
	var datfim = converteDataBrEmDate(dataFinal);

	if (datini == null || datfim == null) {
		return null;
	} else {
		var millisDiff = datfim.getTime() - datini.getTime();
		var secDiff = Math.round(millisDiff / 1000);
		var minDiff = Math.round(secDiff / 60);
		var hourDiff = Math.round(minDiff / 60);
		var daysDiff = Math.round(hourDiff / 24);

		return daysDiff;
	}
}

/**
 * 
 * @param config <object> {
	 * 		grid : <string> - identificador grid (opcional)
	 * 		, campoDataInicial : <string> - identificador campo
	 * 		, campoDataFinal : <string> - identificador campo
	 * 	}
 * @returns {string} quantidade de dias entre uma data e outra
 */
function getDiferencaEntreDataConfig(config) {

	if (config) {
		var grid = config.grid || "";
		var campoDataInicial = config.campoDataInicial || "";
		var campoDataFinal = config.campoDataFinal || "";

		var dataInicial, dataFinal;

		if (grid != "") {
			dataInicial = Form.grids(grid).fields(campoDataInicial).value();
			dataFinal = Form.grids(grid).fields(campoDataFinal).value();
		} else {
			dataInicial = Form.fields(campoDataInicial).value();
			dataFinal = Form.fields(campoDataFinal).value();
		}

		if (dataInicial != null && dataFinal != null) {
			var datini = converteDataBrEmDate(dataInicial);
			var datfim = converteDataBrEmDate(dataFinal);

			var millisDiff = datfim.getTime() - datini.getTime();
			var secDiff = Math.round(millisDiff / 1000);
			var minDiff = Math.round(secDiff / 60);
			var hourDiff = Math.round(minDiff / 60);
			var daysDiff = Math.round(hourDiff / 24);

			return daysDiff;
		}
	}
}

/**
 * Função para a validação de PIS
 * @param config <object> {
	 * 		grid : <string> - identificador grid (opcional)
	 * 		, campo : <string> - identificador campo
	 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'Número PIS inválido!')
	 * 	}
 * @returns {boolean} false = PIS Válido, true = PIS Inválido
 */
function validaPIS(config) {
	if (config) {
		var valor = nulo(config, "");

		var erro = false;

		if (valor != "") {
			var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "Número PIS Inválido";

			valor = valor.replace(/[^\d]+/g, "");
			valor = valor.replace(/\./g, "");
			valor = valor.replace(/-/g, "");
			valor = valor.replace(/\//g, "");

			if (valor == "") {
				return true;
			}

			if (
				isNaN(valor) ||
				valor.length != 11 ||
				valor == '00000000000' || valor == "11111111111" || valor == "22222222222" || valor == "33333333333" ||
				valor == "44444444444" || valor == "55555555555" || valor == "66666666666" || valor == "77777777777" ||
				valor == "88888888888" || valor == "99999999999"
			) {
				erro = true;
			} else {

				var a = [];
				var b = new Number;
				var pesos = "3298765432";

				for (var i = 0; i < 11; i++) {
					a[i] = valor.charAt(i);
					b += (a[i] * pesos.charAt(i));
				}

				var x = b % 11;
				var digitoVerificador = 11 - x;

				if (digitoVerificador > 9) digitoVerificador = 0;

				if (valor.charAt(10) != digitoVerificador) {
					erro = true;
				}
			}

			if (erro) {
				var grid = config.grid || "";
				var campo = config.campo;

				var oCampo;

				if (grid && grid != "") {
					oCampo = Form.grids(grid).fields(campo);
				} else {
					oCampo = Form.fields(campo);
				}

				oCampo.value("");
				adicionaErro(config, mensagem, true);
			} else {
				erro = false;
				removeErro(config, true);
			}
		}

		return !erro;
	}

	return !erro;
}

/**
 * Valida se o arquivo a ser anexado esta na extensão desejada
 * @param config <object> {
	 * 		file : <file> - parametro do evento DOCUMENT_IMPORT_FILE_SUBMITTED
	 * 		, extensoes : <string> - iextensões permitidas (opcional - podem ser várias, separadas por ',', ';', ou passadas em um array)
	 * 	}
 */
function validarExtensaoArquivo(config) {
	if (config) {
		var nomeArquivo = config.file.name;
		var splitArquivo = nomeArquivo.split(".");
		var extensaoArquivo = splitArquivo[(splitArquivo.length) - 1];

		// converte para uppercase a extensao do arquivo
		extensaoArquivo = extensaoArquivo.toLocaleUpperCase().trim();

		var auxExtensoes = [];
		var extensoes = config.extensoes;

		if (extensoes instanceof Array) {
			auxExtensoes = extensoes;
		} else if (extensoes.indexOf(";") != -1) {
			auxExtensoes = extensoes.split(";");
		} else {
			auxExtensoes = extensoes.split(",");
		}

		// converte para uppercase as extensoes permitidas
		auxExtensoes = auxExtensoes.map(function (ext) { return ext.toLocaleUpperCase(); });

		if (auxExtensoes.indexOf(extensaoArquivo) == -1) {
			Form.addCustomModal({ title: "AVISO - A EXTENSÃO DO ARQUIVO NÃO É PERMITIDA", description: "Extensão do arquivo não permitida, favor anexar no(s) formato(s) " + JSON.stringify(auxExtensoes), buttons: [] });
			throw new Error('');
		}
	}
}

/**
 * 
 * @param file - parametro do evento DOCUMENT_IMPORT_FILE_SUBMITTED
 * @param tamanho - Tamanho do Arquivo em Megabyte
 */
/**
 * Valida se o arquivo a ser anexado esta na extensão desejada
 * @param config <object> {
	 * 		file : <file> - parametro do evento DOCUMENT_IMPORT_FILE_SUBMITTED
	 * 		, tamanho : <integer> -  Tamanho do Arquivo em Megabyte
	 * 	}
 */
function validarTamanhoArquivo(config) {
	if (config) {
		var tamanho = config.tamanho;
		var file = config.file;
		var tamanhoArquivo = file.size;

		var tamanhoEmBytes = tamanho * Math.pow(10, 6);

		if (file.size > tamanhoEmBytes) {
			Form.addCustomModal({ title: "AVISO - ARQUIVO MAIOR QUE O PERMITIDO", description: "O tamanho máximo permitido é " + tamanho + "MB, porém o arquivo anexado foi de " + (file.size / Math.pow(10, 6)).toFixed(2) + "MB", buttons: [] });
			throw new Error('');
		}
	}
}

/**
 * Valida se a data informada é maior que a atual
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'A data informada não pode ser menor que a atual!')
 * 	}
 * @return <boolean> - false = Data inválida, true = Data válida
 */
function validaDataMaiorQueAtual(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "A data informada não pode ser menor que a atual!";

		if (campo && campo != "") {
			var dataParam = nulo(config, "");

			var dataAtual = getDataFormatada(new Date());

			var daysDiff = getDiferencaEntreDatas(dataParam, dataAtual);

			if (daysDiff == null || daysDiff > 0) {
				var oCampo;

				if (grid && grid != "") {
					oCampo = Form.grids(grid).fields(campo);
				} else {
					oCampo = Form.fields(campo);
				}

				oCampo.value("");
				adicionaErro(config, mensagem, true);
				return false;
			} else {
				removeErro(config, true);
				return true;
			}
		}
	}
}

/**
 * Valida se a data informada é menor que a atual
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'A data informada não pode ser maior que a atual!')
 * 	}
 * @return <boolean> - false = Data inválida, true = Data válida
 */
function validaDataMenorQueAtual(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "A data informada não pode ser maior que a atual!";

		if (campo && campo != "") {
			var dataParam = nulo(config, "");

			var dataAtual = getDataFormatada(new Date());

			var daysDiff = getDiferencaEntreDatas(dataParam, dataAtual);

			if (daysDiff == null || daysDiff < 0) {
				var oCampo;

				if (grid && grid != "") {
					oCampo = Form.grids(grid).fields(campo);
				} else {
					oCampo = Form.fields(campo);
				}

				oCampo.value("");
				adicionaErro(config, mensagem, true);
				return false;
			} else {
				removeErro(config, true);
				return true;
			}
		}
	}
}

/**
 * Soma o valor da coluna da grid e insere o resultado em outro campo
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo a ser somado
 * 		, campoTotal : <string> - identificador do campo que receberá a soma da GRID
 * 	}
 * @return <string> - retorna NULL caso não consiga realizar a soma
 */
function somaValorGrid(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var campoTotal = config.campoTotal;

		if (grid && grid != "" && campo && campo != "" && campoTotal && campoTotal != "") {
			var gridItem = Form.grids(grid);

			var totalItens = gridItem.columns(campo).sum();
			Form.fields(campoTotal).value(totalItens).apply();
			return totalItens;
		}
	}

	return null;
}

/**
 * Valida se a GRID foi preenchida com a quantidade minima
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo
 * @param config <object> {
 * 		grid : <string> - identificador grid (obrigatorio)
 * 		, quantidade : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'Favor inserir ao menos X itens na GRID!')
 * 	}
 */
function validaPreenchimentoMinimoItensGRID(config) {
	if (config) {
		var grid = config.grid;
		var quantidade = config.quantidade;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "Favor inserir ao menos " + quantidade + " item(ns) na GRID!";

		if (grid && grid != "") {
			Form.actions("aprovar").subscribe('SUBMIT', function (formId, actionId, reject) {
				var tamanhoGrid = Form.grids(grid).dataRows().length;

				console.log("tamanhoGrid: " + tamanhoGrid);
				console.log("quantidade: " + quantidade);
				if (tamanhoGrid < parseInt(quantidade)) {
					Form.grids(grid).errors([mensagem]).apply();
					reject();
				}
			});
		}
	}
}


/**
* Valida se a GRID foi preenchida com a quantidade minima - 
* Metodo pode ser utilizado em casos em que a grid pode ou não ser obrigatoria
* ex: 
* Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
*		 if (Form.grids("DOCS").visible()) {
*			retorno = JSPadrao.validaPreenchimentoMinimoItensGRIDSobDemanda({ "grid": "DOCS", "quantidade": "1" });
* 			if (!retorno) {
*				reject();
*			}
*		} 
*	});
* @param config <object> {
* 		grid : <string> - identificador grid (obrigatorio)
* 		, quantidade : <string> - identificador campo
* 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'Favor inserir ao menos X itens na GRID!')
* 	}
*/
function validaPreenchimentoMinimoItensGRIDSobDemanda(config) {
	debugger;
	if (config) {
		var grid = config.grid;
		var quantidade = config.quantidade;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "Favor inserir ao menos " + quantidade + " itens na GRID!";

		if (grid && grid != "") {
			//if (Form.grids(grid).visible()) {
			var tamanhoGrid = Form.grids(grid).dataRows().length;

			console.log("tamanhoGrid: " + tamanhoGrid);
			console.log("quantidade: " + quantidade);

			if (tamanhoGrid < parseInt(quantidade)) {
				Form.grids(grid).errors([mensagem]).apply();
				return false;
			} else {
				return true;
			}
		}
	}
}




/**
	 *
	 * Valida se a GRID foi preenchida com a quantidade minima e Se possui algum campo da Grid preenchido
	 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo
	 * @param config <object> {
	 * 		        grid : <string> - identificador grid (obrigatorio)
	 * 		, quantidade : <string> - identificador campo
	 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'Favor inserir ao menos X itens na GRID!' ou 'Existem campos preenchidos na Grid que não foram adicionados na tabela' )
	 * 	}
	 * 
	 * Implantação
	 * A chamada deverá ser realizada na função 'SetValidators'  ATENÇÃO - para mais de uma grid deverá ser feita uma validação para cada chamada
	 * 
	 * 	  ############ APENAS UMA GRID ############
	 *	  	if (codigoEtapa == INICIAL) {
	 *
	 * 			Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
	 *			debugger;
	 *       		// Valida se o retorno é falso, se sim cancela o submit
	 *	  			if( !JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "DADOS_PESSOAIS", "quantidade": "1"})){
	 *					reject();
	 *					Form.apply();
	 *				}
	 * 			});	
	 *		 }
	 *	 
	 * 	   ############ MAIS DE UMA GRID ############
	 *	  	if (codigoEtapa == INICIAL) {
	 *
	 * 			Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
	 *			debugger;
	 * 				// Valida se o retorno é falso, se sim cancela o submit
	 *	  			if( !JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "DADOS_PESSOAIS", "quantidade": "1"})){
	 *					reject();
	 *					Form.apply();
	 *				}
	 *				// Valida se o retorno é falso, se sim cancela o submit
	 *				if( !JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "ENDERECO", "quantidade": "2"})){
	 *					reject();
	 *					Form.apply();
	 *				}
	 * 			});	
	 *		 }	 * 
	 */
function validaPreenchimentoMinimoItensGridValidaCamposGrid(config) {
	debugger;

	if (config) {

		var grid = config.grid;
		var quantidade = config.quantidade;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "Favor inserir ao menos " + quantidade + " item(ns) na GRID!";
		var mensagemCamposPreenc = (config.mensagem && config.mensagem != "") ? config.mensagem : "Existem campos preenchidos na GRID que não foram adicionados na tabela";

		if (grid && grid != "") {

			//REGRA QUE IDENTIFICA SE HÁ INFORMAÇÕES NOS CAMPOS DA GRID E NÃO FORAM IMPORTADOS NA TABELA
			var qtdCamposGrid = Form.grids(grid).columns().length;
			var listCampos = [];
			var possuiInfoCamposGrid = false;
			var tamanhoGrid = Form.grids(grid).dataRows().length;


			for (var i = 0; i < qtdCamposGrid; i++) {
				var campo = Form.grids(grid).columns()[i].name;
				listCampos.push(campo);
			}

			for (var i = 0; i < listCampos.length; i++) {

				var idCampo = listCampos[i];

				if (Form.grids(grid).fields(idCampo).value() != "" &&
					Form.grids(grid).fields(idCampo).value() != undefined &&
					Form.grids(grid).fields(idCampo).value() != null) {
					possuiInfoCamposGrid = true;
				}
			}

			console.log("possuiInfoCamposGrid: " + possuiInfoCamposGrid);

			console.log("tamanhoGrid: " + tamanhoGrid);
			console.log("quantidade: " + quantidade);

			//Valida se o tamanho da grid é menor que a quantidade do parametro
			if (tamanhoGrid < parseInt(quantidade)) {
				Form.grids(grid).errors([mensagem]).apply();
				return false;
			} else {

				//Valida se possui algum campo da grid preenchido e não incluido
				if (possuiInfoCamposGrid) {
					Form.grids(grid).errors([mensagemCamposPreenc]).apply();
					return false;
				} else {
					return true;
				}
			}
		}
	}

	Form.apply();
}






/**
	 *
	 * Valida se algum campo da Grid esta preenchido e não foi adicionado na tabela
	 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo
	 * @param config <object> {
	 * 		        grid : <string> - identificador grid (obrigatorio)
	 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'Favor inserir ao menos X itens na GRID!' ou 'Existem campos preenchidos na GRID que não foram adicionados na tabela' )
	 * 	}
	 * 	 * 
	 * Implantação
	 * A chamada deverá ser realizada na função 'SetValidators'  ATENÇÃO - para mais de uma grid deverá ser feita uma validação para cada chamada
	 * 
	 * 	  ############ APENAS UMA GRID ############
	 *	  	if (codigoEtapa == INICIAL) {
	 *
	 * 			Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
	 *			debugger;
	 *       		// Valida se o retorno é falso, se sim cancela o submit
	 *	  			if( !JSPadrao.validaCamposGrid({ "grid": "DADOS_PESSOAIS" })){
	 *					reject();
	 *					Form.apply();
	 *				}
	 * 			});	
	 *		 }
	 *	 
	 * 	   ############ MAIS DE UMA GRID ############
	 *	  	if (codigoEtapa == INICIAL) {
	 *
	 * 			Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
	 *			debugger;
	 * 				// Valida se o retorno é falso, se sim cancela o submit
	 *	  			if( !JSPadrao.validaCamposGrid({ "grid": "DADOS_PESSOAIS"})){
	 *					reject();
	 *					Form.apply();
	 *				}
	 *				// Valida se o retorno é falso, se sim cancela o submit
	 *				if( !JSPadrao.validaCamposGrid({ "grid": "ENDERECO" })){
	 *					reject();
	 *					Form.apply();
	 *				}
	 * 			});	
	 *		 }	 * 
	 */
function validaCamposGrid(config) {
	debugger;

	if (config) {

		var grid = config.grid;
		var mensagemCamposPreenc = (config.mensagem && config.mensagem != "") ? config.mensagem : "Existem campos preenchidos na GRID que não foram adicionados na tabela";

		if (grid && grid != "") {

			//REGRA QUE IDENTIFICA SE HÁ INFORMAÇÕES NOS CAMPOS DA GRID E NÃO FORAM IMPORTADOS NA TABELA
			var qtdCamposGrid = Form.grids(grid).columns().length;
			var listCampos = [];
			var possuiInfoCamposGrid = false;

			for (var i = 0; i < qtdCamposGrid; i++) {
				var campo = Form.grids(grid).columns()[i].name;
				listCampos.push(campo);
			}

			for (var i = 0; i < listCampos.length; i++) {

				var idCampo = listCampos[i];

				if (Form.grids(grid).fields(idCampo).value() != "" &&
					Form.grids(grid).fields(idCampo).value() != undefined &&
					Form.grids(grid).fields(idCampo).value() != null) {
					possuiInfoCamposGrid = true;
				}
			}
			console.log("possuiInfoCamposGrid: " + possuiInfoCamposGrid);

			//Valida se possui algum campo da grid preenchido
			if (possuiInfoCamposGrid) {
				Form.grids(grid).errors([mensagemCamposPreenc]).apply();
				return false;
			} else {
				return true;
			}
		}
	}
	Form.apply();


}

/**
 *  Limpar as opções do campo lista
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 	}
 * @return <boolean> - false = caso houver algum erro, true = sucesso ao limpar lista
 */
function limparOpcoesCampoLista(config) {
	if (config) {
		var grid = config.grid || "";
		var campo = config.campo;

		if (campo && campo != "") {
			var formulario = Form;

			if (grid != "") {
				formulario = Form.grids(grid);
			}

			formulario.fields(campo).clear().apply();

			return true;
		}
	}

	return false
}

/**
 * Adiciona opcoes nos campos lista
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo lista
 * 		, opcoesLista : <string> - Opçoes que serão adicionadas separadas por ponto e virgula(;)
 * 	}
 * @return <boolean> - false = caso houver algum erro, true = sucesso ao adicionar na lista
 */
function adicionaOpcoesCampoLista(config) {
	if (config) {
		var grid = config.grid || "";
		var campo = config.campo;
		var opcoesLista = config.opcoesLista;

		Form.apply().then(function () {
			var formulario = Form;

			if (grid != "") {
				formulario = Form.grids(grid);
			}

			opcoesLista = "" + opcoesLista;

			var splitOpcoesLista = opcoesLista.split(";");

			formulario.fields(campo).addOptions(splitOpcoesLista).apply();

			return true;
		});
	}

	return false;
}

/**
 * 
 * @param nomeCampo -  Nome do campo
 * @param nomeGrid - Identificador da GRID
 * @returns {Boolean} 
 */
/**
 * Valida se a data informada é um dia de final de semana
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'A data informada não pode ser um final de semana!')
 * 	}
 * @return <boolean> - false = Data Inválida, true = Data Válida
 */
function validaDataFinalDeSemana(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "A data informada não pode ser um final de semana!";

		if (campo && campo != "") {

			var dataParam = nulo(config, "");

			if (dataParam != "") {
				var curdate = converteDataBrEmDate(dataParam);

				if (curdate.getDay() == 0 || curdate.getDay() == 6) {
					var oCampo;

					if (grid && grid != "") {
						oCampo = Form.grids(grid).fields(campo);
					} else {
						oCampo = Form.fields(campo);
					}

					oCampo.value("");

					adicionaErro(config, mensagem, true);
					return false;
				} else {
					removeErro(config, true);
					return true;
				}
			}
		}
	}
}

/**
 * Função que calcula idade a partir de uma data de nascimento informada
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo data de nascimento
 * 		, campoIdade : <integer> - identificador campo idade
 * 	}
 */
function calculaIdade(config) {
	if (config) {
		var grid = config.grid || "";
		var campo = config.campo;
		var campoIdade = config.campoIdade;
		var dataNascimento = nulo(config, "");

		var dateArray = dataNascimento.split("/");
		var diaNascimento, mesNascimento, anoNascimento;

		if (dateArray.length > 1) {
			diaNascimento = Number(dateArray[0]);
			mesNascimento = Number(dateArray[1]) - 1;
			anoNascimento = Number(dateArray[2]);
		} else {
			dateArray = dataNascimento.split("-");
			diaNascimento = Number(dateArray[2]);
			mesNascimento = Number(dateArray[1]) - 1;
			anoNascimento = Number(dateArray[0]);
		}

		var anoAtual = (new Date()).getFullYear();

		var dataAniversario = diaNascimento + "/" + mesNascimento + "/" + anoAtual;
		var anoCompleto = getDiferencaEntreDatas(dataAniversario, getDataFormatada(new Date())) >= 0;
		var idade = anoAtual - Number(anoNascimento);

		if (!anoCompleto) idade--;

		var formulario = Form;

		if (grid != "") {
			formulario = Form.grids(grid);
		}

		formulario.fields(campoIdade).value(idade).apply();

		return idade;
	}
}

/**
 * Verifica se a hora informada é uma hora válida
 * Sempre executará um apply() ao final do método, de forma a limpar o valor do campo e exibir a mensagem.
 * @param config <object> {
 * 		grid : <string> - identificador grid (opcional)
 * 		, campo : <string> - identificador campo
 * 		, mensagem : <string> - mensagem a ser exibida no campo (opcional - default 'A hora informada é inválida! Verifique.')
 * 	}
 * @return <boolean> - Hora Inválida, true = Hora Válida
 */
function validaHora(config) {
	if (config) {
		var grid = config.grid;
		var campo = config.campo;
		var mensagem = (config.mensagem && config.mensagem != "") ? config.mensagem : "A hora informada é inválida! Verifique.";

		if (campo && campo != "") {
			var hora = nulo(config, "");

			if (hora != "") {
				var aHora = hora.split(":");

				var hora = Number(aHora[0]);
				var minuto = Number(aHora[1]);

				if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
					var oCampo;

					if (grid && grid != "") {
						oCampo = Form.grids(grid).fields(campo);
					} else {
						oCampo = Form.fields(campo);
					}

					oCampo.value("");

					adicionaErro(config, mensagem, true);
					return false;
				} else {
					removeErro(config, true);
					return true;
				}
			}
		}
	}

	return false;
}
}());