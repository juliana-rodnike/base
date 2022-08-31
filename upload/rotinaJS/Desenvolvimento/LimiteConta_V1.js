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
var SOLICITAR_LIMITE    = 1;
var ANALISE_TECNICA     = 9;
var ANALISE_COMITE      = 5;
var GERAR_LOTE          = 8;
var APROVAR_LOTE        = 7;
var GERAR_CCB           = 6;
var COLETAR_ASSINATURAS = 2;
var IMPLANTAR_LIMITE    = 4;

/*
 * Inicializa layout geral
 */
function initLayout(){
	

}

/*
 * Define Labels com mais de 50 caracteres
 */
function defineLabels() {
	

}

/*
 * Define ações / listeners
 */
function setEventos() {

	if(codigoEtapa == ANALISE_TECNICA || codigoEtapa == ANALISE_COMITE){

		Form.fields("ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			if(response == "Prosseguir"){				

				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}	
			
			if(response == "Devolver"){			

				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}			

		});	

	}

	if(codigoEtapa == APROVAR_LOTE){

		Form.fields("ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			if(response == "Prosseguir"){				

				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}	
			
			if(response == "Cancelar"){			

				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}			

		});		
		
	}	
	
	if(codigoEtapa == IMPLANTAR_LIMITE){

		Form.fields("ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			if(response == "Prosseguir"){	
				
				Form.fields('ASSINATURA').visible(false).apply();
				Form.fields('CONFERE').visible(false).apply();
				Form.fields('DOC_INCOMPLETO').visible(false).apply();
				Form.fields('INFO_INCOMPLETO').visible(false).apply();				

				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}	
			
			if(response == "Devolver"){			

				Form.fields('ASSINATURA').visible(true).apply();
				Form.fields('CONFERE').visible(true).apply();
				Form.fields('DOC_INCOMPLETO').visible(true).apply();
				Form.fields('INFO_INCOMPLETO').visible(true).apply();				

				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}			

		});			

	}
	
	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm(){

	if(codigoEtapa == SOLICITAR_LIMITE){

		Form.groups("AUXILIAR").visible(false).apply();

	}

	if(codigoEtapa == COLETAR_ASSINATURAS){

		if(codigoCiclo == 1){

			Form.groups("AUXILIAR").visible(false).apply();

		}
		else{

			Form.fields('ASSINATURA').visible(true).apply();
			Form.fields('CONFERE').visible(true).apply();
			Form.fields('DOC_INCOMPLETO').visible(true).apply();
			Form.fields('INFO_INCOMPLETO').visible(true).apply();

			Form.fields('ASSINATURA').readOnly(true).apply();
			Form.fields('CONFERE').readOnly(true).apply();
			Form.fields('DOC_INCOMPLETO').readOnly(true).apply();
			Form.fields('INFO_INCOMPLETO').readOnly(true).apply();			

		}

	}	

	if(codigoEtapa == ANALISE_TECNICA || codigoEtapa == ANALISE_COMITE || codigoEtapa == APROVAR_LOTE || codigoEtapa == IMPLANTAR_LIMITE){

		Form.actions('aprovar').disabled(true).apply();
		Form.actions('rejeitar').disabled(true).apply();

	}
	
	Form.apply();
}


/*
 * Define novas regras de validação dos campos
 */
function setValidators(){


}