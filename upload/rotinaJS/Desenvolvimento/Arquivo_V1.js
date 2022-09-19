$(document).ready(function () {
	setForm();
	setEventos();
	setValidators();

	Form.apply().then(function () {
		defineLabels();
		initLayout();
	});
});


// Dados da atividade
var codigoProcesso = ProcessData.processInstanceId;
var codigoEtapa = ProcessData.activityInstanceId;
var codigoCiclo = ProcessData.cycle;


//Atividades do processo
var ENVIO_PROTOCOLO = 2;
var CONFIRMAR_PROTOCOLO = 6;
var CONFIRMAR_RECEBIMENTO = 1;
var DEFINIR_ROTA = "Finalizar Chamado";

/*
 * Inicializa layout geral
 */
function initLayout() {

	//	if( codigoEtapa == SOLICITAR ){
	//		Form.fields("SOLICITACAO1").className("col m12");
	//	}
	//	
	//	Form.apply();
}


/*
 * Define Labels com mais de 50 caracteres
 */
function defineLabels() {

	//	Form.fields("VEIC_MODELO").label("Label a ser definido");

	//	Form.apply();
}


/*
 * Define ações / listeners
 */
function setEventos() {

	debugger;

	var botao = "";
	var status = "";
	var dados = Form.grids("GRID_DADOS").dataRows();

	if (codigoEtapa == CONFIRMAR_PROTOCOLO) {

		Form.actions('aprovar').disabled(true).apply();

		Form.grids("GRID_DADOS").fields('FORMATO_DOC').subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			dados = Form.grids("GRID_DADOS").dataRows();

			for (var i = 0; i < dados.length; i++) {

				status = dados[i].FORMATO_DOC;
				console.log("Linha: " + i);
				console.log("Formato: " + status);

				if (status == "Enviado" || status == "Não Recebido") {

					botao = "Não desbloquear";
					break;

				}
				else
					botao = "Desbloquear";

			}

			console.log("Botão: " + botao);

			if (botao == "Desbloquear") {
				Form.actions('aprovar').disabled(false).apply();
			}
			if (botao == "Não desbloquear")
				Form.actions('aprovar').disabled(true).apply();

		});

	}


	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm() {

	var formato = "";
	var dados = Form.grids("GRID_DADOS").dataRows();

	if (codigoEtapa == CONFIRMAR_RECEBIMENTO) {

		console.log("Início de validação da Grid");
		console.log("Tamanho: " + dados.length);

		for (var i = 0; i < dados.length; i++) {

			formato = dados[i].FORMATO_DOC;
			console.log("Linha: " + i);
			console.log("Formato: " + formato);

			if (formato == "Físico") {

				console.log("Entrou no if");
				DEFINIR_ROTA = "Confirmar Entrega";
				break;

			}

		}

		console.log("Definir Rota: " + DEFINIR_ROTA);
		Form.fields("AUX_ROTA").value(DEFINIR_ROTA).apply();

	}

	if (codigoEtapa == ENVIO_PROTOCOLO) {

		var lista = Form.grids("GRID_DADOS").fields('FORMATO_DOC');

		lista.addOptions([
			{ name: "Enviado", value: "Enviado" },
		]).apply();

	}

	if (codigoEtapa == CONFIRMAR_PROTOCOLO) {

		var lista = Form.grids("GRID_DADOS").fields('FORMATO_DOC');

		lista.addOptions([
			{ name: "Recebido", value: "Recebido" },
			{ name: "Não Recebido", value: "Não Recebido" },
		]).apply();

	}

	Form.apply();
}


/*
 * Define novas regras de validação dos campos
 */
function setValidators() {



}