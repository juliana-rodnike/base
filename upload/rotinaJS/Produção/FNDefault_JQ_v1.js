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
var codigoEtapa = ProcessData.activityInstanceId;
var codigoCiclo = ProcessData.cycle;


//Atividades do processo
var SOLICITAR = 1;
var ANALISAR = 2;


/*
 * Inicializa layout geral
 */
function initLayout(){
	
//	if( codigoEtapa == ATENDER_COOPERADO ){
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

	// Etapa Solicitação
	if (codigoEtapa == SOLICITAR) {
		
//		Form.fields("MODALIDADEPJ").subscribe("BLUR", function(itemId, data, response) {
//			console.log("MODALIDADEPJ : " + Form.fields("MODALIDADEPJ").value());
//			insertGarantiaVeiculo();
//		});
//		
		Form.fields("VEIC_MODELO").subscribe("CHANGE", function(itemId, data, response) {
			console.log("VEIC_MODELO : " + response);
			insertGarantiaVeiculo();
		});
		
	}
	
	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm(){

	if (codigoEtapa == SOLICITAR) {

//		var tipoPessoa = Form.fields("TIPOPESSOA").value();
////		console.log("tipoPessoa : " + tipoPessoa);
//
//		if(tipoPessoa == "Pessoa Física"){
//			return validaCPFObj({ form: form, campo: nomeCampo });
//
//		} else if(tipoPessoa == "Pessoa Jurídica"){
//			return validaCNPJObj({ form: form, campo: nomeCampo });
//
//		} else {
//			return true;
//		}
		
	}
	
	Form.apply();
}


/*
 * Define novas regras de validação dos campos
 */
function setValidators(){

	if (codigoEtapa == SOLICITAR) {

		Form.actions("aprovar").subscribe("SUBMIT",function (itemId, action, reject) {
			var formErrors = Form.errors();

//			var isGridComprovantesInvalido = validaGridComprovantesCondicionante();
//			if(isGridComprovantesInvalido){
//				formErrors["COMPROVANTES_CONDICI"] = ['Favor inserir ao menos um comprovante!'];
//				Lecom.api.FlashMessageAPI.flash().addMessage({type:"error",message:"Favor inserir ao menos um comprovante!"});
//			}

			Form.errors(formErrors);

			if (Object.keys(formErrors).length) reject();

			Form.apply();
		});
	}
}
