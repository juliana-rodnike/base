$(document).ready( function() {
	setEventos();
	setForm();
	setValidators();

	Form.apply().then( function() {
		defineLabels();
		initLayout();
	});
});


// Dados da atividade
var codigoProcesso = ProcessData.processInstanceId;
var codigoEtapa    = ProcessData.activityInstanceId;
var codigoCiclo    = ProcessData.cycle;

//Atividades do processo
var GERAR_COTACAO    = 4;
var ANALISAR_COTACAO = 3;

/*
 * Inicializa layout geral
 */
function initLayout(){
	
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

	if(codigoEtapa == GERAR_COTACAO){

		// Atualizar texto padrão para o tipo de seguro
		Form.fields("TIPO_SEGURO").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Empresarial" || response == "Equipamentos" || response == "Residencial"){

				Form.fields("DESCRICAO").value
				("Prezados,\n\Segue cotação de renovação de seguro, por gentileza conferir os dados com o cliente e verificar a possibilidade de alteração dos valores, " 
				+"devido à valorização dos imóveis e equipamentos. Se não tivermos retorno a renovação será efetivada com 2 dias antes do vencimento e qualquer cancelamento " 
				+"ou alteração posterior será de responsabilidade do comercial da agência.").apply();

			}
			else if(response == "Auto"){

				Form.fields("DESCRICAO").value
				("Prezados,\n\Segue cotação de renovação do seguro de automóvel, pedimos por gentileza que seja conferido os dados com o cliente e em caso de ajustes atualizar o cálculo. " 
				+"A efetivação e agendamento de vistoria (quando necessário) é de responsabilidade do P.A.").apply();

			}

		});

	}	

	
	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm(){

	if(codigoEtapa == ANALISAR_COTACAO){
		
		// Mostrar ID dos botoes
		console.log(Form.actions().map(function(a){ return a.id}));

		// Não permitir devolver para seguro auto
		var response = Form.fields("TIPO_SEGURO").value();
		if(response == "Auto"){ Form.actions('rejeitar').hidden(true).apply(); }

	}
	
	
	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators(){

	if (codigoEtapa == GERAR_COTACAO) {

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
			
			debugger;

			if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "G_ANEXOS", "quantidade": "1" })){
				reject();
				Form.apply();
			}

			debugger;

		});	
	}
}