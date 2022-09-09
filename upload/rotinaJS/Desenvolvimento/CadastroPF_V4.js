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
var codigoEtapa    = ProcessData.activityInstanceId;
var codigoCiclo    = ProcessData.cycle;

// Atividades do processo
var SOLICITAR_CADASTRO   		= 11;
var ASSUMIR_ATIVIDADE 			= 15;
var REALIZAR_CADASTRO_SISBR     = 13;
var CADASTRO_SISBR_OUTRA_COOP   = 18;
var REGULARIZAR_PERFIL_CADASTRO = 16;
var COMPLEMENTAR_CADASTRO_SISBR = 2;
var COMPLEM_SISBR_OUTRA_COOP    = 17;
var FINALIZAR_CADASTRO 			= 6;
var GERAR_CRL 					= 19;
var ATUALIZAR_CRL 				= 20;

// Variáveis auxiliares
var tipoCad   = "";
var objtCad   = "";
var nomeUser  = "";
var auxData   = "";
var updtRenda = "";
var updtBens  = "";
var updtResid = "";
var updtClint = "";
var updtCons  = "";
var grupoCrl  = "";
var perfil    = "";
var modal     = "";
var relax     = "";
var auxCadAdd = "";
var updtExt   = "";
var ciclo     = 0;

// Dados titular
var cpfConjT  = "";
var nomConjT  = "";
var cpfTit    = "";
var nomTit    = "";
var civilT    = "";
var regimeT   = "";
var ref1T     = "";
var telRef1T  = "";
var ref2T     = "";
var telRef2T  = "";
var procRep   = "";
var cpfRepT   = "";
var nomeRepT  = "";
var area      = "";

function initLayout() {
}

function defineLabels() {
}

/*
 * Define ações / listeners
 */
function setEventos() {

	debugger;

	if (codigoEtapa == SOLICITAR_CADASTRO){

		// Limpar campo do objetivo, ocultar grupos e desmarcar checkbox quando alterar o tipo de cadastro
		Form.fields("TIPO_CADASTRO").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields('UPDATE_RENDA').checked(false).apply();
			Form.fields('UPDATE_RESIDENCIA').checked(false).apply();
			Form.fields('UPDATE_CLIENTE').checked(false).apply();
		
		});			

		// Carregar campos atualização pessoa física
		Form.fields("TIPO_CADASTRO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			tipoCad = Form.fields("TIPO_CADASTRO").value();

			// Atualização Cadastral
			if(tipoCad == "Atualização Cadastral"){

				Form.fields('UPDATE_RENDA').visible(true).apply();
				Form.fields('UPDATE_RESIDENCIA').visible(true).apply();
				Form.fields('UPDATE_CLIENTE').visible(true).apply();

				// Dados do cliente obrigatório para abertura de conta
				Form.fields('ESCOLARIDADE').visible(false).apply();
				Form.fields('ESCOLARIDADE').setRequired('aprovar', false).apply();
				Form.fields('ESTADO_CIVIL').visible(false).apply();
				Form.fields('ESTADO_CIVIL').setRequired('aprovar', false).apply();
				Form.fields('PROCURADOR_REPRE_LEGAL').visible(false).apply();
				Form.fields('PROCURADOR_REPRE_LEGAL').setRequired('aprovar', false).apply();					

				// Ocultar contatos e referência
				Form.fields('CEL').visible(false).apply();
				Form.fields('CEL_AD').visible(false).apply();
				Form.fields('TEL').visible(false).apply();
				Form.fields('EMAIL').visible(false).apply();
				Form.fields('REFERENCIA_UM').visible(false).apply();
				Form.fields('CEL_TEL_REF_UM').visible(false).apply();
				Form.fields('REFERENCIA_DOIS').visible(false).apply();
				Form.fields('CEL_TEL_REF_DOIS').visible(false).apply();
				
				// Campos obrigatórios para cadastro novo contatos e referências
				Form.fields('CEL').setRequired('aprovar', false).apply();
				Form.fields('REFERENCIA_UM').setRequired('aprovar', false).apply();
				Form.fields('CEL_TEL_REF_UM').setRequired('aprovar', false).apply();
				Form.fields('REFERENCIA_DOIS').setRequired('aprovar', false).apply();
				Form.fields('CEL_TEL_REF_DOIS').setRequired('aprovar', false).apply();
				Form.fields('RENDA').setRequired('aprovar', false).apply();				

				Form.groups('IDENTIFICACAO').visible(false).apply();
				Form.groups('ENDERECO').visible(false).apply();
				Form.groups('RENDA').visible(false).apply();
				
			}

			// Novo Cadastro
			else{

				// Ocultar campos para atualização cadastral
				Form.fields('UPDATE_RENDA').visible(false).apply();
				Form.fields('UPDATE_RESIDENCIA').visible(false).apply();
				Form.fields('UPDATE_CLIENTE').visible(false).apply();

				// Mostrar grupos para cadastro novo
				Form.groups('IDENTIFICACAO').visible(true).apply();
				Form.groups('ENDERECO').visible(true).apply();
				Form.groups('RENDA').visible(true).apply();

				// Dados do cliente obrigatórios para cadastro novo
				Form.fields('ESCOLARIDADE').visible(true).apply();
				Form.fields('ESCOLARIDADE').setRequired('aprovar', true).apply();
				Form.fields('ESTADO_CIVIL').visible(true).apply();
				Form.fields('ESTADO_CIVIL').setRequired('aprovar', true).apply();
				Form.fields('PROCURADOR_REPRE_LEGAL').visible(true).apply();
				Form.fields('PROCURADOR_REPRE_LEGAL').setRequired('aprovar', true).apply();	

				// Mostrar contatos e referência
				Form.fields('CEL').visible(true).apply();
				Form.fields('CEL_AD').visible(true).apply();
				Form.fields('TEL').visible(true).apply();
				Form.fields('EMAIL').visible(true).apply();
				Form.fields('REFERENCIA_UM').visible(true).apply();
				Form.fields('CEL_TEL_REF_UM').visible(true).apply();
				Form.fields('REFERENCIA_DOIS').visible(true).apply();
				Form.fields('CEL_TEL_REF_DOIS').visible(true).apply();
				
				// Campos obrigatórios para cadastro novo contatos e referências
				Form.fields('RENDA').setRequired('aprovar', true).apply();
				Form.fields('CEL').setRequired('aprovar', true).apply();
				Form.fields('REFERENCIA_UM').setRequired('aprovar', true).apply();
				Form.fields('CEL_TEL_REF_UM').setRequired('aprovar', true).apply();
				Form.fields('REFERENCIA_DOIS').setRequired('aprovar', true).apply();
				Form.fields('CEL_TEL_REF_DOIS').setRequired('aprovar', true).apply();

				// Campos de grid obrigatórios
				Form.grids("GRD_DOCUMENTOS").fields('ANEXO_DOCUMENTOS_IDENT').setRequired('aprovar', true).apply();
				Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true).apply();

				// Bloquear campos de nome e data
				Form.grids("GRD_DOCUMENTOS").fields('ID_NOME_ADD').disabled(true).apply();
				Form.grids("GRD_DOCUMENTOS").fields('ID_HORA_ADD').disabled(true).apply();
				Form.grids("GRD_RESIDENCIA").fields('RESID_NOME_ADD').disabled(true).apply();
				Form.grids("GRD_RESIDENCIA").fields('RESID_HORA_ADD').disabled(true).apply();
				Form.grids("GRD_COMP_RENDA").fields('RENDA_NOME_ADD').disabled(true).apply();
				Form.grids("GRD_COMP_RENDA").fields('RENDA_HORA_ADD').disabled(true).apply();

			}

		});	
		
		// Formuário atualização de renda
		Form.fields("OBJETIVO").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Inclusão de Titular"){

				// Dados da conta
				Form.groups("DADOS_CONTA").visible(true).apply();
				Form.fields("CPF_CONTA").visible(false).apply();
				Form.fields("NOME_CONTA").visible(false).apply();				
				
				Form.grids("G_CONTA").readOnly(true).apply();

				Form.fields('CONTA').setRequired('aprovar', true).apply();
				Form.fields('ABERTURA').setRequired('aprovar', true).apply();
				Form.fields('CATEGORIA').setRequired('aprovar', true).apply();

				// Dados do capital do titular
				Form.fields("CAPITAL").visible(true).apply();
				Form.fields('CAPITAL').setRequired('aprovar', true).apply();

			}
			else{

				// Dados da conta
				Form.groups("DADOS_CONTA").visible(false).apply();

				Form.fields('CONTA').setRequired('aprovar', false).apply();
				Form.fields('ABERTURA').setRequired('aprovar', false).apply();
				Form.fields('CATEGORIA').setRequired('aprovar', false).apply();		
				
				// Dados do capital do titular
				Form.fields("CAPITAL").visible(false).apply();
				Form.fields('CAPITAL').setRequired('aprovar', false).apply();

			}

		});			
		
		// Mostrar campos para cadastro múltiplo
		Form.fields("MODALIDADE").subscribe("CHANGE", function(itemId, data, response) {
			
			modal = response;
			updtClint = Form.fields("UPDATE_CLIENTE").value();

			// Cadastro Múltiplo
			if(modal == "Múltiplo"){

				// Campos grid cadastro adicional
				Form.groups("CADASTRO_ADICIONAL").visible(true).apply();
				Form.grids("G_CAD_ADD").visible(true).apply();

				// Campos titular
				Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("CEL_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("CEL_ADD2").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("TEL_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("EMAIL_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").visible(false).apply();

				// Campos conjuge
				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(false).apply();

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false).apply();

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();

				// Campos obrigatórios
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("CPF_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("NOME_ADD").setRequired('aprovar', true).apply();

				// Campos de grid
				Form.grids("GRD_DOCUMENTOS").fields("REFERENCIA_ID").visible(true).apply();
				Form.grids("GRD_RESIDENCIA").fields("REFERENCIA_RESID").visible(true).apply();
				Form.grids("GRD_COMP_RENDA").fields("REFERENCIA_RENDA").visible(true).apply();	

			}

			// Cadastro Individual
			else{

				Form.groups("CADASTRO_ADICIONAL").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").setRequired('aprovar', false).apply();
				Form.grids("G_CAD_ADD").fields("CPF_ADD").setRequired('aprovar', false).apply();
				Form.grids("G_CAD_ADD").fields("NOME_ADD").setRequired('aprovar', false).apply();
				Form.grids("GRD_DOCUMENTOS").fields("REFERENCIA_ID").visible(false).apply();
				Form.grids("GRD_RESIDENCIA").fields("REFERENCIA_RESID").visible(false).apply();
				Form.grids("GRD_COMP_RENDA").fields("REFERENCIA_RENDA").visible(false).apply();
				Form.grids("GRD_DOCUMENTOS").columns("REFERENCIA_ID").visible(false).apply();
				Form.grids("GRD_RESIDENCIA").columns("REFERENCIA_RESID").visible(false).apply();
				Form.grids("GRD_COMP_RENDA").columns("REFERENCIA_RENDA").visible(false).apply();

			}

		});				
		
		// Formuário atualização de renda
		Form.fields("UPDATE_RENDA").subscribe("CHANGE", function(itemId, data, response) {
			
			console.log("update renda: " + response);

			if(response == "Sim"){

				Form.groups('RENDA').visible(true).apply();
				Form.fields('RENDA').visible(false).apply();
				Form.grids("GRD_COMP_RENDA").fields('RENDA_NOME_ADD').disabled(true).apply();
				Form.grids("GRD_COMP_RENDA").fields('RENDA_HORA_ADD').disabled(true).apply();
				Form.grids("GRD_COMP_RENDA").fields('COMPROVANTE_RENDA').setRequired('aprovar', true).apply();

			}
			else{

				Form.grids("GRD_COMP_RENDA").fields('COMPROVANTE_RENDA').setRequired('aprovar', false).apply();
				Form.groups('RENDA').visible(false).apply();

			}

		});	
		
		// Formuário atualização endereço
		Form.fields("UPDATE_RESIDENCIA").subscribe("CHANGE", function(itemId, data, response) {
			
			console.log("update residencia: " + response);

			if(response == "Sim"){

				Form.groups('ENDERECO').visible(true).apply();
				Form.grids("GRD_RESIDENCIA").fields('RESID_NOME_ADD').disabled(true).apply();
				Form.grids("GRD_RESIDENCIA").fields('RESID_HORA_ADD').disabled(true).apply();
				Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true).apply();

			}
			else{

				Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true).apply();
				Form.groups('ENDERECO').visible(false).apply();

			}

		});	
		
		// Formuário atualização dados do cliente
		Form.fields("UPDATE_CLIENTE").subscribe("CHANGE", function(itemId, data, response) {
			
			console.log("update cliente: " + response);

			if(response == "Sim"){

				Form.groups('IDENTIFICACAO').visible(true).apply();
				Form.grids("GRD_DOCUMENTOS").fields('ID_NOME_ADD').disabled(true).apply();
				Form.grids("GRD_DOCUMENTOS").fields('ID_HORA_ADD').disabled(true).apply();

				Form.fields('REFERENCIA_UM').visible(true).apply();
				Form.fields('CEL_TEL_REF_UM').visible(true).apply();
				Form.fields('REFERENCIA_DOIS').visible(true).apply();
				Form.fields('CEL_TEL_REF_DOIS').visible(true).apply();
				Form.fields('CEL').visible(true).apply();
				Form.fields('CEL_AD').visible(true).apply();
				Form.fields('TEL').visible(true).apply();
				Form.fields('EMAIL').visible(true).apply();				

			}
			else{

				Form.groups('IDENTIFICACAO').visible(false).apply();
				Form.fields('REFERENCIA_UM').visible(false).apply();
				Form.fields('CEL_TEL_REF_UM').visible(false).apply();
				Form.fields('REFERENCIA_DOIS').visible(false).apply();
				Form.fields('CEL_TEL_REF_DOIS').visible(false).apply();	
				Form.fields('CEL').visible(false).apply();
				Form.fields('CEL_AD').visible(false).apply();
				Form.fields('TEL').visible(false).apply();
				Form.fields('EMAIL').visible(false).apply();			

			}

		});		
		
		// Atualizar nome e hora na grid
		Form.grids("GRD_DOCUMENTOS").fields("ANEXO_DOCUMENTOS_IDENT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_USER").value();

			Form.grids("GRD_DOCUMENTOS").fields("ID_NOME_ADD").value(nomeUser).apply();
			Form.grids("GRD_DOCUMENTOS").fields("ID_HORA_ADD").value(auxData).apply();


		});		

		// Atualizar nome e hora na grid
		Form.grids("GRD_RESIDENCIA").fields("COMPROVANTE").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_USER").value();

			Form.grids("GRD_RESIDENCIA").fields("RESID_NOME_ADD").value(nomeUser).apply();
			Form.grids("GRD_RESIDENCIA").fields("RESID_HORA_ADD").value(auxData).apply();


		});		

		// Atualizar nome e hora na grid
		Form.grids("GRD_COMP_RENDA").fields("COMPROVANTE_RENDA").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_USER").value();

			Form.grids("GRD_COMP_RENDA").fields("RENDA_NOME_ADD").value(nomeUser).apply();
			Form.grids("GRD_COMP_RENDA").fields("RENDA_HORA_ADD").value(auxData).apply();


		});		
		
		// Atualizar nome e hora na grid
		Form.grids("GRD_ANEXOS_COMP").fields("ANEXOS_COMPLEMENTARES").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_USER").value();

			Form.grids("GRD_ANEXOS_COMP").fields("COMP_NOME_ADD").value(nomeUser).apply();
			Form.grids("GRD_ANEXOS_COMP").fields("COMP_HORA_ADD").value(auxData).apply();


		});			

		//Valida CPF PROPONENTE
		Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
			console.log("CPF: " + retorno);
		});

		//Valida CPF CONJUGE
		Form.fields("CPF_CONJUGE").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF_CONJUGE" });
			console.log("CPF_CONJUGE: " + retorno);
		});

		//Valida EMAIL PROPONENTE
		Form.fields("EMAIL").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaEmail({ "campo": "EMAIL" });
			console.log("EMAIL: " + retorno);
		});

		Form.fields("DECLARACAO_PA").subscribe("CHANGE", function (itemId, data, response) {
			
			console.log("Check PA: " + response);	

			if(response == "Sim"){

				Form.fields("AUX_USER").value("").apply();

			}
			
		});		
		
		Form.fields("SQL_CPF").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("response: " + response);

			var tipo = Form.fields("TIPO_CADASTRO").value();
			var cpf = Form.fields("CPF").value();

			if(tipo == "Novo Cadastro" && cpf == response){

				console.log("Cadastro já existe");

			}

		});		

		// Linha da grid inserção
		Form.grids("G_CAD_ADD").subscribe("GRID_SUBMIT", function (itemId, data, response) {
			
			// Campos titular
			Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("CEL_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("CEL_ADD2").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("TEL_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("EMAIL_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").visible(false).apply();

			// Campos conjuge
			Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(false).apply();

			// Campos complementares
			Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false).apply();	
			Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false).apply();

			// Ajuste de linhas
			Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();


		});		

		// Linha da grid atualização
		Form.grids("G_CAD_ADD").subscribe("GRID_EDIT", function (itemId, data, response) {

			// Campos titular
			Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_ADD2").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("TEL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("EMAIL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").visible(true).apply();			

		});		
		
		// Relacionar informações de cônjuge e representante para cadastro múltiplo
		Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").subscribe("CHANGE", function(itemId, data, response) {
			
			tipoCad = Form.fields("TIPO_CADASTRO").value();

			// Campos titular
			Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_ADD2").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("TEL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("EMAIL_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").visible(true).apply();
			Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").visible(true).apply();

			// Campos conjuge
			Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(false).apply();	
			Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(false).apply();

			// Campos complementares
			Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("DESC_RELAC").setRequired('aprovar', false).apply();

			// Campos obrigatórios cadastro novo
			if(tipoCad == "Novo Cadastro"){

				Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("CEL_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").setRequired('aprovar', true).apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").setRequired('aprovar', true).apply();

			}

			// Campos adicional conjuge
			if(response == "Cônjuge"){

				cpfTit   = Form.fields("CPF").value();
				nomTit   = Form.fields("NOME").value();
				cpfConjT = Form.fields("CPF_CONJUGE").value();
				civilT   = Form.fields("ESTADO_CIVIL").value();
				regimeT  = Form.fields("REGIME_CASAMENTO").value();
				nomConjT = Form.fields("NOME_CONJUGE").value();				

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(true).apply();

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").lineBreak('SIMPLES').apply();				
				
				// Carregar valores
				Form.grids("G_CAD_ADD").fields("CPF_ADD").value(cpfConjT).apply();
				Form.grids("G_CAD_ADD").fields("NOME_ADD").value(nomConjT).apply();
				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").value(cpfTit).apply();
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").value(nomTit).apply();
				Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").value(civilT).apply();


				// Campo regime de casamento
				if(civilT == "Casado"){
					
					Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").value(regimeT).apply();
				
				}

			}
			else
			if(response == "Procurador/Rep. Legal"){

				cpfRepT  = Form.fields("CPF_PROCURADOR_REP_LEGA").value();
				nomeRepT = Form.fields("NOME_PROCURADOR_REP").value();
				
				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();		

				// Carregar valores
				Form.grids("G_CAD_ADD").fields("CPF_ADD").value(cpfRepT).apply();
				Form.grids("G_CAD_ADD").fields("NOME_ADD").value(nomeRepT).apply();

			}
			else
			if(response == "Outros"){

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").setRequired('aprovar', true).apply();

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('NENHUM').apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").lineBreak('SIMPLES').apply();
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").lineBreak('SIMPLES').apply();

			}
			else{

				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").setRequired('aprovar', false).apply();				

			}
			

		});	

		// Relacionar informações de cônjuge e representante para cadastro múltiplo
		Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			// Campos adicional conjuge
			if(response == "Cônjuge"){		

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(true).apply();

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").lineBreak('SIMPLES').apply();				

			}
			else
			if(response == "Procurador/Rep. Legal"){
				
				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();		

			}
			else
			if(response == "Outros"){

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").setRequired('aprovar', true).apply();

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('NENHUM').apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").lineBreak('SIMPLES').apply();
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").lineBreak('SIMPLES').apply();

			}
			else{

				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false).apply();
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES').apply();
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").setRequired('aprovar', false).apply();				

			}
			

		});			
		
		// Estado civil cadastro adicional
		Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").subscribe("CHANGE", function(itemId, data, response) {

			Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(false).apply();
			Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(false).apply();
			
			Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").setRequired('aprovar', false).apply();	
			Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").setRequired('aprovar', false).apply();	
			Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").setRequired('aprovar', false).apply();
			Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").setRequired('aprovar', false).apply();

			if(response == "Casado"){
				
				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(true).apply();

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").setRequired('aprovar', true).apply();	
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").setRequired('aprovar', true).apply();	
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").setRequired('aprovar', true).apply();					

			}	
			else
			if(response == "União Estável"){

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(true).apply();

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").setRequired('aprovar', true).apply();	
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").setRequired('aprovar', true).apply();					

			}
			else
			if(response == "Viúvo" || response == "Divorciado"){

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").removeMask().apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").setRequired('aprovar', true).apply();	


			}
			else{

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").removeMask().apply();

			}	

		});		

		// Estado civil cadastro adicional
		Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			if(response == "Casado"){
				
				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(true).apply();

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").setRequired('aprovar', true).apply();	
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").setRequired('aprovar', true).apply();	
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").setRequired('aprovar', true).apply();					

			}	
			else
			if(response == "União Estável"){

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(true).apply();

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").setRequired('aprovar', true).apply();	
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").setRequired('aprovar', true).apply();					

			}
			else
			if(response == "Viúvo" || response == "Divorciado"){

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").removeMask().apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(true).apply();
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").setRequired('aprovar', true).apply();	


			}
			else{

				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").removeMask().apply();

			}	

		});			
		
		// Replicar referências comerciais do cadastro titular para cadastro adicional
		Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Sim"){

				ref1T    = Form.fields("REFERENCIA_UM").value();
				ref2T    = Form.fields("REFERENCIA_DOIS").value();
				telRef1T = Form.fields("CEL_TEL_REF_UM").value();
				telRef2T = Form.fields("CEL_TEL_REF_DOIS").value();

				Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").value(ref1T).apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").value(ref2T).apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").value(telRef1T).apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").value(telRef2T).apply();

			}
			else{

				Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").value("").apply();
				Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").value("").apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").value("").apply();
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").value("").apply();

			}

		});		

		// Consulta de titulares da conta
		Form.fields("SQL_TITULARES").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("response: " + response);

			let dadosGrid = Form.grids('G_CONTA').dataRows();

			if (dadosGrid.length > 0) {

				//limpa informações da GRid
				let grid = Form.grids("G_CONTA");

				grid.dataRows(function (dataRow) {
					grid.removeDataRow(dataRow.id);
				});
			}

			var listaTitulares = response.split(";");

			listaTitulares.forEach(function (dados) {

				var titualares = Form.grids("G_CONTA");

				var cpf  = dados.split("@")[0];
				var nome = dados.split("@")[1];
				var data = dados.split("@")[2];

				titualares.insertDataRow(
					{
						CPF_TITULAR: cpf,
						NOME_TITULAR: nome,
						DATA_UPDT: data
					}
				);

			});

		});				

	}

	if(codigoEtapa == REALIZAR_CADASTRO_SISBR || codigoEtapa == CADASTRO_SISBR_OUTRA_COOP || 
	   codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR || codigoEtapa == COMPLEM_SISBR_OUTRA_COOP){

		Form.fields("ROTA").subscribe("CHANGE", function(itemId, data, response) {

			console.log("Rota: " + response);
			
			if(response == "Prosseguir"){				

				Form.fields('DOC_INVALIDO').visible(false).apply();
				Form.fields('DOC_NAO_ENVIADO').visible(false).apply();
				Form.fields('DOC_INSUFICIENTE').visible(false).apply();
				Form.fields('FALTA_INFORMACOES').visible(false).apply();
				Form.fields('INFO_SISBR').visible(false).apply();

				// Não atualizar a variável quando o cadastro for de outra cooperativa para não perder a rota
				if(codigoEtapa == REALIZAR_CADASTRO_SISBR || codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR) Form.fields("AUX_GRUPO_CRL").value("Não").apply();

				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}	
			
			if(response == "Gerar CRL"){				

				Form.fields('DOC_INVALIDO').visible(false).apply();
				Form.fields('DOC_NAO_ENVIADO').visible(false).apply();
				Form.fields('DOC_INSUFICIENTE').visible(false).apply();
				Form.fields('FALTA_INFORMACOES').visible(false).apply();				
				Form.fields('INFO_SISBR').visible(false).apply();				

				Form.fields("AUX_GRUPO_CRL").value("Sim").apply();

				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			
			if(response == "Devolver"){

				Form.fields('DOC_INVALIDO').visible(true).apply();
				Form.fields('DOC_NAO_ENVIADO').visible(true).apply();
				Form.fields('DOC_INSUFICIENTE').visible(true).apply();
				Form.fields('FALTA_INFORMACOES').visible(true).apply();
				Form.fields('INFO_SISBR').visible(true).apply();

				Form.fields("AUX_GRUPO_CRL").value("").apply();

				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}				

		});			

		if(codigoEtapa == REALIZAR_CADASTRO_SISBR){

			// Replicar consultas externas do titular
			Form.grids("G_EXTERNAS_ADD").fields("IMPORTAR_EXT_TITULAR").subscribe("CHANGE", function(itemId, data, response) {

				// Carregar tipo de relacionamento do adicional com o titular
				relax = Form.grids("G_EXTERNAS_ADD").fields("RELACIONAMENTO_EXT").value();

				if(response == "Sim"){

					// Dados consultas exteras titular
					var scoreT        = Form.fields("PONTUACAO_SCORE_TITULAR").value();
					var restT         = Form.fields("RESTRICOES").value();
					var jusRestT      = Form.fields("JUSTIFICATIVA_RESTRICAO").value();
					var scoreConjT    = Form.fields("PONTUACAO_SCORE_CONJUGE").value();
					var restConjT     = Form.fields("RESTRICOES_CONJUGE").value();
					var justRestConjT = Form.fields("JUSTIFICATIVA_RESTR_CON").value();
					var scoreProcT	  = Form.fields("SCORE_PROC_REP").value();
					var restProcT     = Form.fields("RESTRICOES_PROC_REP").value();
					var justRestProcT = Form.fields("JUST_REST_PROC_REP").value();
					
					if(relax == "Cônjuge"){

						Form.grids("G_EXTERNAS_ADD").fields("PONTUACAO_SCORE_ADD").value(scoreConjT).apply();
						Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_ADD").value(restConjT).apply();
						Form.grids("G_EXTERNAS_ADD").fields("SCORE_CONJUGE_ADD").value(scoreT).apply();
						Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_CONJUGE_ADD").value(restT).apply();

						// Mostrar campo de justificação restrição cadastro adicional
						Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_ADD").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

							if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
								
								Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(true).apply();
								Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTRICAO_ADD").value(justRestConjT).apply();

							}
				
						});	
						
						// Mostrar campo de justificação restrição cadastro conjuge adicional
						Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_CONJUGE_ADD").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

							if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
								
								Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').visible(true).apply();
								Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTR_CON_ADD").value(jusRestT).apply();

							}
				
						});							

					}

					if(relax == "Procurador/Rep. Legal"){

						Form.grids("G_EXTERNAS_ADD").fields("PONTUACAO_SCORE_ADD").value(scoreProcT).apply();
						Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_ADD").value(restProcT).apply();

						// Mostrar campo de justificação restrição cadastro adicional
						Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_ADD").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

							if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
								
								Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(true).apply();
								Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTRICAO_ADD").value(justRestProcT).apply();

							}
				
						});							

					}					

				}
				else{

					Form.grids("G_EXTERNAS_ADD").fields("PONTUACAO_SCORE_ADD").value("").apply();
					Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_ADD").value("").apply();
					Form.grids("G_EXTERNAS_ADD").fields("SCORE_CONJUGE_ADD").value("").apply();
					Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_CONJUGE_ADD").value("").apply();		
					Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTRICAO_ADD").value("").apply();	
					Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTR_CON_ADD").value("").apply();		

				}

			});	

			// Mostrar campo de justificação restrição cadastro adicional
			Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_ADD").subscribe("CHANGE", function(itemId, data, response) {

				if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
					
					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(true).apply();
					Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTRICAO_ADD").setRequired('aprovar', true).apply();

				}
				else{

					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(false).apply();
					Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTRICAO_ADD").setRequired('aprovar', false).apply();

				}
	
			});	

			// Mostrar campo de justificação restrição conjuge cadastro adicional
			Form.grids("G_EXTERNAS_ADD").fields("RESTRICOES_CONJUGE_ADD").subscribe("CHANGE", function(itemId, data, response) {

				if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
					
					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').visible(true).apply();
					Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTR_CON_ADD").setRequired('aprovar', true).apply();

				}
				else{

					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').visible(false).apply();
					Form.grids("G_EXTERNAS_ADD").fields("JUST_RESTR_CON_ADD").setRequired('aprovar', false).apply();

				}
	
			});			
			
			// Mostrar campo de justificação restrição cadastro adicional
			Form.fields("RESTRICOES_PROC_REP").subscribe("CHANGE", function(itemId, data, response) {
			
				if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
					
					Form.fields('JUST_REST_PROC_REP').visible(true).apply();
					Form.fields('JUST_REST_PROC_REP').setRequired('aprovar', true).apply();

				}
				else{

					Form.fields('JUST_REST_PROC_REP').visible(false).apply();
					Form.fields('JUST_REST_PROC_REP').setRequired('aprovar', false).apply();

				}
	
			});		
			
			// Mostrar campo de justificação restrição cadastro adicional
			Form.fields("RESTRICOES_CONJUGE").subscribe("CHANGE", function(itemId, data, response) {

				if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
					
					Form.fields('JUSTIFICATIVA_RESTR_CON').visible(true).apply();
					Form.fields('JUSTIFICATIVA_RESTR_CON').setRequired('aprovar', true).apply();

				}
				else{

					Form.fields('JUSTIFICATIVA_RESTR_CON').visible(false).apply();
					Form.fields('JUSTIFICATIVA_RESTR_CON').setRequired('aprovar', false).apply();

				}
	
			});				
			
			// Linha da grid selecionada para edição
			Form.grids("G_EXTERNAS_ADD").subscribe("GRID_EDIT", function (itemId, data, response) {

				Form.grids("G_EXTERNAS_ADD").fields('IMPORTAR_EXT_TITULAR').visible(true).apply();
				Form.grids("G_EXTERNAS_ADD").fields('PONTUACAO_SCORE_ADD').visible(true).apply();
				Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_ADD').visible(true).apply();

				Form.grids("G_EXTERNAS_ADD").fields('PONTUACAO_SCORE_ADD').setRequired('aprovar', true).apply();
				Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_ADD').setRequired('aprovar', true).apply();

			});	
			
			// Linha da grid atualizada
			Form.grids("G_EXTERNAS_ADD").subscribe("GRID_EDIT_SUBMIT", function (itemId, data, response) {

				Form.fields("UPD_EXT_ADD").value("Sim").apply();
				Form.grids("G_EXTERNAS_ADD").fields('PONTUACAO_SCORE_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('SCORE_CONJUGE_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_CONJUGE_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('IMPORTAR_EXT_TITULAR').visible(false).apply();


			});			

			// Cancelar edição
			Form.grids("G_EXTERNAS_ADD").subscribe("GRID_RESET", function (itemId, data, response) {

				Form.grids("G_EXTERNAS_ADD").fields('PONTUACAO_SCORE_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('SCORE_CONJUGE_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_CONJUGE_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').visible(false).apply();
				Form.grids("G_EXTERNAS_ADD").fields('IMPORTAR_EXT_TITULAR').visible(false).apply();


			});					
			
			// Estado civil cadastro adicional
			Form.grids("G_EXTERNAS_ADD").fields("AUX_CIVIL_ADD").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

				if(response == "Casado" || response == "União Estável"){

					Form.grids("G_EXTERNAS_ADD").fields('SCORE_CONJUGE_ADD').visible(true).apply();
					Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_CONJUGE_ADD').visible(true).apply();
					Form.grids("G_EXTERNAS_ADD").fields('SCORE_CONJUGE_ADD').setRequired('aprovar', true).apply();
					Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_CONJUGE_ADD').setRequired('aprovar', true).apply();

				}
				else{

					Form.grids("G_EXTERNAS_ADD").fields('SCORE_CONJUGE_ADD').setRequired('aprovar', false).apply();
					Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_CONJUGE_ADD').setRequired('aprovar', false).apply();
					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').setRequired('aprovar', false).apply();

				}

			});		

			// Relacionamento grid consultas externas
			Form.grids("G_EXTERNAS_ADD").fields("RELACIONAMENTO_EXT").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

				console.log(response);

				// importar consultas externas somente quando o adicional for cônjuge
				if(response == "Cônjuge"){

					Form.grids("G_EXTERNAS_ADD").fields('IMPORTAR_EXT_TITULAR').visible(true).apply();

				}
				else{

					Form.grids("G_EXTERNAS_ADD").fields('IMPORTAR_EXT_TITULAR').visible(false).apply();

				}

			});				

			// Mostrar campo de justificação restrição cadastro adicional
			Form.fields("AUX_CAD_ADD").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

				civilT = Form.fields("ESTADO_CIVIL").value();

				if((response == "Sim" && civilT == "Casado") || ((response == "Sim" && civilT == "União Estável"))){

					Form.fields('PONTUACAO_SCORE_CONJUGE').visible(true).apply();
					Form.fields('RESTRICOES_CONJUGE').visible(true).apply();
					Form.fields('PONTUACAO_SCORE_CONJUGE').setRequired('aprovar', true).apply();
					Form.fields('RESTRICOES_CONJUGE').setRequired('aprovar', true).apply();

				}
	
			});							

		}		

	}

	// Tratamento grid Anexos Complementares
	if(codigoEtapa == REALIZAR_CADASTRO_SISBR ||codigoEtapa == CADASTRO_SISBR_OUTRA_COOP || 
	   codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR ||codigoEtapa == REGULARIZAR_PERFIL_CADASTRO || codigoEtapa == COMPLEM_SISBR_OUTRA_COOP){

		// Atualizar nome e hora na grid
		Form.grids("GRD_ANEXOS_COMP").fields("ANEXOS_COMPLEMENTARES").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_USER").value();

			Form.grids("GRD_ANEXOS_COMP").fields("COMP_NOME_ADD").value(nomeUser).apply();
			Form.grids("GRD_ANEXOS_COMP").fields("COMP_HORA_ADD").value(auxData).apply();


		});				
		
		// Console linha adicionada
		Form.grids("GRD_ANEXOS_COMP").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});	

	}		

	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm() {

	if(codigoEtapa == SOLICITAR_CADASTRO){

		// Configurar formulário para chamado novo e chamado devolvido
		ciclo   = Form.fields("CICLO").value();
		tipoCad = Form.fields("TIPO_CADASTRO").value();	
		objtCad = Form.fields('OBJETIVO').value();
		perfil  = Form.fields("PERFIL").value();
		modal   = Form.fields("MODALIDADE").value();

		console.log("ciclo: "      + ciclo);
		console.log("tipo: "       + tipoCad);
		console.log("objetivo: "   + objtCad);
		console.log("perfil: "     + perfil);
		console.log("modalidade: " + modal);

		// Ocultar grupos de consultas externas
		Form.groups('EXTERNAS_ADICIONAL').visible(false);
		Form.groups('EXTERNAS_TITULAR').visible(false);
		Form.groups('DADOS_CONTA').visible(false);
		
		// Chamado novo
		if(ciclo == 1){

			Form.groups('IDENTIFICACAO').visible(false);
			Form.groups('ENDERECO').visible(false);
			Form.groups('RENDA').visible(false);
			Form.groups('CADASTRO_ADICIONAL').visible(false);
			Form.groups('ACOES').visible(false);

			// Inclusão de titular
			if(objtCad == "Inclusão de Titular"){

				Form.groups("DADOS_CONTA").visible(true);
				Form.fields("CPF_CONTA").visible(false);
				Form.fields("NOME_CONTA").visible(false);				
				
				Form.grids("G_CONTA").readOnly(true);

				Form.fields('CONTA').setRequired('aprovar', true);
				Form.fields('ABERTURA').setRequired('aprovar', true);
				Form.fields('CATEGORIA').setRequired('aprovar', true);
				
				Form.fields("CAPITAL").visible(true).apply();
				Form.fields("CAPITAL").setRequired('aprovar', true).apply();

			}				

			// Modalidade de cadastro
			if(modal == "Múltiplo"){ 
				
				// Grid cadastros adicionais
				Form.groups('CADASTRO_ADICIONAL').visible(true); 
				Form.grids("G_CAD_ADD").visible(true); 

				// Campos titular
				Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_ADD2").visible(false);
				Form.grids("G_CAD_ADD").fields("TEL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("EMAIL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").visible(false);
				Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").visible(false);

				// Campos conjuge
				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(false);

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false);
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false);

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES');

				// Campos obrigatórios
				Form.grids("G_CAD_ADD").fields("CPF_ADD").setRequired('aprovar', true);
				Form.grids("G_CAD_ADD").fields("NOME_ADD").setRequired('aprovar', true);				
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").setRequired('aprovar', true);
			
			}

			// Perfil de cadastro
			if(perfil == "Perfil de Exceção"){ 
				
				Form.fields('JUSTIFICATIVA_PERFIL').visible(true); 
			
			}	
			
			// Atualização Cadastral
			if(tipoCad == "Atualização Cadastral"){

				// Ocultar grupos de anexos
				Form.groups('IDENTIFICACAO').visible(false);
				Form.groups('ENDERECO').visible(false);
				Form.groups('RENDA').visible(false);
	
				// Mostrar checkbox atualização
				Form.fields('UPDATE_RENDA').visible(true);
				Form.fields('UPDATE_RESIDENCIA').visible(true);
				Form.fields('UPDATE_CLIENTE').visible(true);		
				
				updtRenda = Form.fields('UPDATE_RENDA');
				updtResid = Form.fields('UPDATE_RESIDENCIA');
				updtClint = Form.fields('UPDATE_CLIENTE');	

				Form.fields('ESCOLARIDADE').visible(true);
				Form.fields('ESTADO_CIVIL').visible(true);
				Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);				

				if(updtRenda == "Sim"){
	
					Form.groups('RENDA').visible(true);
					Form.fields('RENDA').visible(false);
					Form.grids("GRD_COMP_RENDA").fields('RENDA_NOME_ADD').disabled(true);
					Form.grids("GRD_COMP_RENDA").fields('RENDA_HORA_ADD').disabled(true);
					Form.grids("GRD_COMP_RENDA").fields('COMPROVANTE_RENDA').setRequired('aprovar', true);
	
				}	
				if(updtResid == "Sim"){
	
					Form.groups('ENDERECO').visible(true);
					Form.grids("GRD_RESIDENCIA").fields('RESID_NOME_ADD').disabled(true);
					Form.grids("GRD_RESIDENCIA").fields('RESID_HORA_ADD').disabled(true);
					Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true);
	
					Form.fields('CIDADE').visible(false);
					Form.fields('AREA_ATUACAO').visible(false);
	
				}		
				if(updtClint == "Sim"){
	
					Form.groups('IDENTIFICACAO').visible(true);
					Form.grids("GRD_DOCUMENTOS").fields('ID_NOME_ADD').disabled(true);
					Form.grids("GRD_DOCUMENTOS").fields('ID_HORA_ADD').disabled(true);

					Form.fields('ESCOLARIDADE').visible(true);
					Form.fields('ESTADO_CIVIL').visible(true);
					Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);

					// Mostrar contatos e referência
					Form.fields('CEL').visible(true);
					Form.fields('CEL_AD').visible(true);
					Form.fields('TEL').visible(true);
					Form.fields('EMAIL').visible(true);
					Form.fields('REFERENCIA_UM').visible(true);
					Form.fields('CEL_TEL_REF_UM').visible(true);
					Form.fields('REFERENCIA_DOIS').visible(true);
					Form.fields('CEL_TEL_REF_DOIS').visible(true);					
	
				}						
				
			}

			// Cadastro Novo
			else if (tipoCad == "Novo Cadastro"){

				// Mostrar grupos para cadastro novo
				Form.groups('IDENTIFICACAO').visible(true);
				Form.groups('ENDERECO').visible(true);
				Form.groups('RENDA').visible(true);

				// Dados do cliente obrigatórios para cadastro novo
				Form.fields('ESCOLARIDADE').visible(true);
				Form.fields('ESCOLARIDADE').setRequired('aprovar', true);
				Form.fields('ESTADO_CIVIL').visible(true);
				Form.fields('ESTADO_CIVIL').setRequired('aprovar', true);
				Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
				Form.fields('PROCURADOR_REPRE_LEGAL').setRequired('aprovar', true);	

				// Mostrar contatos e referência
				Form.fields('CEL').visible(true);
				Form.fields('CEL_AD').visible(true);
				Form.fields('TEL').visible(true);
				Form.fields('EMAIL').visible(true);
				Form.fields('REFERENCIA_UM').visible(true);
				Form.fields('CEL_TEL_REF_UM').visible(true);
				Form.fields('REFERENCIA_DOIS').visible(true);
				Form.fields('CEL_TEL_REF_DOIS').visible(true);
				
				// Campos obrigatórios para cadastro novo contatos e referências
				Form.fields('RENDA').setRequired('aprovar', true);
				Form.fields('CEL').setRequired('aprovar', true);
				Form.fields('REFERENCIA_UM').setRequired('aprovar', true);
				Form.fields('CEL_TEL_REF_UM').setRequired('aprovar', true);
				Form.fields('REFERENCIA_DOIS').setRequired('aprovar', true);
				Form.fields('CEL_TEL_REF_DOIS').setRequired('aprovar', true);	

				// Campos de grid obrigatórios
				Form.grids("GRD_DOCUMENTOS").fields('ANEXO_DOCUMENTOS_IDENT').setRequired('aprovar', true);
				Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true);

				// Bloquear campos de nome e data
				Form.grids("GRD_DOCUMENTOS").fields('ID_NOME_ADD').disabled(true);
				Form.grids("GRD_DOCUMENTOS").fields('ID_HORA_ADD').disabled(true);
				Form.grids("GRD_RESIDENCIA").fields('RESID_NOME_ADD').disabled(true);
				Form.grids("GRD_RESIDENCIA").fields('RESID_HORA_ADD').disabled(true);
				Form.grids("GRD_COMP_RENDA").fields('RENDA_NOME_ADD').disabled(true);
				Form.grids("GRD_COMP_RENDA").fields('RENDA_HORA_ADD').disabled(true);										
	
			}			

		}

		// Chamado devolvido
		if(ciclo > 1){

			// Bloquear campos principais
			Form.fields("MODALIDADE").disabled(true);
			Form.fields("TIPO_CADASTRO").disabled(true);
			Form.fields("OBJETIVO").disabled(true);	
			Form.fields('DECLARACAO_PA').checked(false);

			// Mostrar checkbox motivo chamado devolvido
			Form.fields('DOC_INVALIDO').visible(true);
			Form.fields('DOC_NAO_ENVIADO').visible(true);
			Form.fields('DOC_INSUFICIENTE').visible(true);
			Form.fields('FALTA_INFORMACOES').visible(true);	
			Form.fields('INFO_SISBR').visible(true);	
			Form.fields('DOC_INVALIDO').readOnly(true);
			Form.fields('DOC_NAO_ENVIADO').readOnly(true);
			Form.fields('DOC_INSUFICIENTE').readOnly(true);
			Form.fields('FALTA_INFORMACOES').readOnly(true);		
			Form.fields('INFO_SISBR').readOnly(true);		
			
			// Comentário obrigatório caso o chamado tenha sido devolvido
			Form.fields('OBSERVACOES').setRequired('aprovar', true);		
			
			// Inclusão de titular
			if(objtCad == "Inclusão de Titular"){

				Form.groups("DADOS_CONTA").visible(true);
				Form.fields("CPF_CONTA").visible(false);
				Form.fields("NOME_CONTA").visible(false);				
				
				Form.grids("G_CONTA").readOnly(true);

				Form.fields('CONTA').setRequired('aprovar', true);
				Form.fields('ABERTURA').setRequired('aprovar', true);
				Form.fields('CATEGORIA').setRequired('aprovar', true);

				Form.fields("CAPITAL").visible(true).apply();
				Form.fields("CAPITAL").setRequired('aprovar', true).apply();

			}			

			// Cadastro múltiplo
			if(modal == "Múltiplo"){ 
				
				// Grid cadastros adicionais
				Form.groups('CADASTRO_ADICIONAL').visible(true); 
				Form.grids("G_CAD_ADD").visible(true); 

				// Campos titular
				Form.grids("G_CAD_ADD").fields("ESCOLARIDADE_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("ESTADO_CIVIL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_ADD2").visible(false);
				Form.grids("G_CAD_ADD").fields("TEL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("EMAIL_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("REFERENCIAS_TITULAR").visible(false);
				Form.grids("G_CAD_ADD").fields("REFERENCIA_UM_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_UM_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("REFERENCIA_DOIS_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("CEL_TEL_REF_DOIS_ADD").visible(false);

				// Campos conjuge
				Form.grids("G_CAD_ADD").fields("CPF_CONJUGE_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("NOME_CONJUGE_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("REGIME_CASAMENTO_ADD").visible(false);
				Form.grids("G_CAD_ADD").fields("COMP_CIVIL_ADD").visible(false);

				// Campos complementares
				Form.grids("G_CAD_ADD").fields("ADD_TITULAR").visible(false);
				Form.grids("G_CAD_ADD").fields("DESC_RELAC").visible(false);

				// Ajuste de linhas
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").lineBreak('SIMPLES');

				// Campos obrigatórios
				Form.grids("G_CAD_ADD").fields("CPF_ADD").setRequired('aprovar', true);
				Form.grids("G_CAD_ADD").fields("NOME_ADD").setRequired('aprovar', true);				
				Form.grids("G_CAD_ADD").fields("RELACIONAMENTO").setRequired('aprovar', true);		

			}
			// Cadastro individual
			else if(modal == "Individual"){ Form.groups('CADASTRO_ADICIONAL').visible(false); }

			// Perfil de cadastro
			if(perfil == "Perfil de Exceção"){ 
				
				Form.fields('JUSTIFICATIVA_PERFIL').visible(true); 
			
			}

			// Atualização Cadastral
			if(tipoCad == "Atualização Cadastral"){

				// Ocultar grupos de anexos
				Form.groups('IDENTIFICACAO').visible(false);
				Form.groups('ENDERECO').visible(false);
				Form.groups('RENDA').visible(false);
	
				// Mostrar checkbox atualização
				Form.fields('UPDATE_RENDA').visible(true);
				Form.fields('UPDATE_RESIDENCIA').visible(true);
				Form.fields('UPDATE_CLIENTE').visible(true);		
				
				updtRenda = Form.fields('UPDATE_RENDA');
				updtResid = Form.fields('UPDATE_RESIDENCIA');
				updtClint = Form.fields('UPDATE_CLIENTE');	

				Form.fields('ESCOLARIDADE').visible(true);
				Form.fields('ESTADO_CIVIL').visible(true);
				Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);				

				if(updtRenda == "Sim"){
	
					Form.groups('RENDA').visible(true);
					Form.fields('RENDA').visible(false);
					Form.grids("GRD_COMP_RENDA").fields('RENDA_NOME_ADD').disabled(true);
					Form.grids("GRD_COMP_RENDA").fields('RENDA_HORA_ADD').disabled(true);
					Form.grids("GRD_COMP_RENDA").fields('COMPROVANTE_RENDA').setRequired('aprovar', true);
	
				}	
				if(updtResid == "Sim"){
	
					Form.groups('ENDERECO').visible(true);
					Form.grids("GRD_RESIDENCIA").fields('RESID_NOME_ADD').disabled(true);
					Form.grids("GRD_RESIDENCIA").fields('RESID_HORA_ADD').disabled(true);
					Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true);
	
					Form.fields('CIDADE').visible(false);
					Form.fields('AREA_ATUACAO').visible(false);
	
				}		
				if(updtClint == "Sim"){
	
					Form.groups('IDENTIFICACAO').visible(true);
					Form.grids("GRD_DOCUMENTOS").fields('ID_NOME_ADD').disabled(true);
					Form.grids("GRD_DOCUMENTOS").fields('ID_HORA_ADD').disabled(true);

					Form.fields('ESCOLARIDADE').visible(true);
					Form.fields('ESTADO_CIVIL').visible(true);
					Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);

					// Mostrar contatos e referência
					Form.fields('CEL').visible(true);
					Form.fields('CEL_AD').visible(true);
					Form.fields('TEL').visible(true);
					Form.fields('EMAIL').visible(true);
					Form.fields('REFERENCIA_UM').visible(true);
					Form.fields('CEL_TEL_REF_UM').visible(true);
					Form.fields('REFERENCIA_DOIS').visible(true);
					Form.fields('CEL_TEL_REF_DOIS').visible(true);					
	
				}						
				
			}

			// Cadastro Novo
			else if (tipoCad == "Novo Cadastro"){

				// Mostrar grupos para cadastro novo
				Form.groups('IDENTIFICACAO').visible(true);
				Form.groups('ENDERECO').visible(true);
				Form.groups('RENDA').visible(true);

				// Dados do cliente obrigatórios para cadastro novo
				Form.fields('ESCOLARIDADE').visible(true);
				Form.fields('ESCOLARIDADE').setRequired('aprovar', true);
				Form.fields('ESTADO_CIVIL').visible(true);
				Form.fields('ESTADO_CIVIL').setRequired('aprovar', true);
				Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
				Form.fields('PROCURADOR_REPRE_LEGAL').setRequired('aprovar', true);	

				// Mostrar contatos e referência
				Form.fields('CEL').visible(true);
				Form.fields('CEL_AD').visible(true);
				Form.fields('TEL').visible(true);
				Form.fields('EMAIL').visible(true);
				Form.fields('REFERENCIA_UM').visible(true);
				Form.fields('CEL_TEL_REF_UM').visible(true);
				Form.fields('REFERENCIA_DOIS').visible(true);
				Form.fields('CEL_TEL_REF_DOIS').visible(true);
				
				// Campos obrigatórios para cadastro novo contatos e referências
				Form.fields('RENDA').setRequired('aprovar', true);
				Form.fields('CEL').setRequired('aprovar', true);
				Form.fields('REFERENCIA_UM').setRequired('aprovar', true);
				Form.fields('CEL_TEL_REF_UM').setRequired('aprovar', true);
				Form.fields('REFERENCIA_DOIS').setRequired('aprovar', true);
				Form.fields('CEL_TEL_REF_DOIS').setRequired('aprovar', true);	

				// Campos de grid obrigatórios
				Form.grids("GRD_DOCUMENTOS").fields('ANEXO_DOCUMENTOS_IDENT').setRequired('aprovar', true);
				Form.grids("GRD_RESIDENCIA").fields('COMPROVANTE').setRequired('aprovar', true);

				// Bloquear campos de nome e data
				Form.grids("GRD_DOCUMENTOS").fields('ID_NOME_ADD').disabled(true);
				Form.grids("GRD_DOCUMENTOS").fields('ID_HORA_ADD').disabled(true);
				Form.grids("GRD_RESIDENCIA").fields('RESID_NOME_ADD').disabled(true);
				Form.grids("GRD_RESIDENCIA").fields('RESID_HORA_ADD').disabled(true);
				Form.grids("GRD_COMP_RENDA").fields('RENDA_NOME_ADD').disabled(true);
				Form.grids("GRD_COMP_RENDA").fields('RENDA_HORA_ADD').disabled(true);										
	
			}				

		}

		Form.grids("GRD_ANEXOS_COMP").fields('COMP_NOME_ADD').disabled(true);
		Form.grids("GRD_ANEXOS_COMP").fields('COMP_HORA_ADD').disabled(true);		

	}

	if(codigoEtapa == ASSUMIR_ATIVIDADE){
 
		 tipoCad   = Form.fields("TIPO_CADASTRO").value();
		 modal     = Form.fields("MODALIDADE").value();
		 updtRenda = Form.fields('UPDATE_RENDA').value();
		 updtResid = Form.fields('UPDATE_RESIDENCIA').value();
		 updtClint = Form.fields('UPDATE_CLIENTE').value();
		 objtCad   = Form.fields("OBJETIVO").value();
 
		 // Ocultar grupos principais
		 Form.groups('IDENTIFICACAO').visible(false);
		 Form.groups('ENDERECO').visible(false);
		 Form.groups('RENDA').visible(false);
		 Form.groups('ACOES').visible(false);
		 Form.groups('DECLARACOES').visible(false);
		 Form.groups('EXTERNAS_TITULAR').visible(false);
		 Form.groups('EXTERNAS_ADICIONAL').visible(false);
		 
		 // Cadastro Múltiplo
		 if(modal == "Múltiplo"){
 
			 Form.grids("G_CAD_ADD").readOnly(true);
 
		 }

		 //Cadastro Individual
		 else{
 
			Form.groups("CADASTRO_ADICIONAL").visible(false);
			Form.grids("G_CAD_ADD").visible(false);
			Form.grids("G_EXTERNAS_ADD").visible(false);
 
		 }
 
		 // Atualização Cadastral
		 if(tipoCad == "Atualização Cadastral"){
 
			 Form.fields('UPDATE_RENDA').visible(true);
			 Form.fields('UPDATE_RESIDENCIA').visible(true);
			 Form.fields('UPDATE_CLIENTE').visible(true);
			 Form.fields('UPDATE_RENDA').readOnly(true);
			 Form.fields('UPDATE_RESIDENCIA').readOnly(true);
			 Form.fields('UPDATE_CLIENTE').readOnly(true);

			 if(updtRenda == "Sim"){
 
				 Form.groups('RENDA').visible(true);
				 Form.fields('RENDA').visible(false);
				 Form.groups('RENDA').grids('GRD_COMP_RENDA').disabled(true);
 
			 }	
			 if(updtResid == "Sim"){
 
				 Form.groups('ENDERECO').visible(true);
				 Form.fields('CIDADE').visible(false);
				 Form.fields('AREA_ATUACAO').visible(false);
				 Form.groups('ENDERECO').grids('GRD_RESIDENCIA').disabled(true);
 
			 }		
			 if(updtClint == "Sim"){
 
				 Form.groups('IDENTIFICACAO').visible(true);
				 Form.groups('IDENTIFICACAO').grids('GRD_DOCUMENTOS').disabled(true);
 
				 Form.fields('ESCOLARIDADE').visible(true);
				 Form.fields('ESCOLARIDADE').readOnly(true);
 
				 Form.fields('ESTADO_CIVIL').visible(true);
				 Form.fields('ESTADO_CIVIL').readOnly(true);
 
				 Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
				 Form.fields('PROCURADOR_REPRE_LEGAL').readOnly(true);
 
			 }						
			 
		 }

		 // Cadastro Novo
		 else{
 
			 // Ocultar campos para atualização cadastral
			 Form.fields('UPDATE_RENDA').visible(false);
			 Form.fields('UPDATE_RESIDENCIA').visible(false);
			 Form.fields('UPDATE_CLIENTE').visible(false);
 
			 // Mostrar grupos para cadastro novo
			 Form.groups('IDENTIFICACAO').visible(true);
			 Form.groups('ENDERECO').visible(true);
			 Form.groups('RENDA').visible(true);
 
			 // Deixar as grids como somente leitura
			 Form.grids("GRD_DOCUMENTOS").readOnly(true);
			 Form.grids("GRD_RESIDENCIA").readOnly(true);
			 Form.grids("GRD_COMP_RENDA").readOnly(true);
 
			 // Dados do cliente obrigatórios para cadastro novo
			 Form.fields('ESCOLARIDADE').visible(true);
			 Form.fields('ESCOLARIDADE').readOnly(true);
			 Form.fields('ESTADO_CIVIL').visible(true);
			 Form.fields('ESTADO_CIVIL').readOnly(true);
			 Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
			 Form.fields('PROCURADOR_REPRE_LEGAL').readOnly(true);
			 Form.fields('RENDA').readOnly(true);
			 Form.fields('AREA_ATUACAO').visible(false);
			 Form.fields('CIDADE').visible(false);

		 }

	}	

	if(codigoEtapa == REALIZAR_CADASTRO_SISBR){

		tipoCad   = Form.fields("TIPO_CADASTRO").value();
		modal     = Form.fields("MODALIDADE").value();
		updtRenda = Form.fields('UPDATE_RENDA').value();
		updtResid = Form.fields('UPDATE_RESIDENCIA').value();
		updtClint = Form.fields('UPDATE_CLIENTE').value();
		procRep   = Form.fields("PROCURADOR_REPRE_LEGAL").value();
		objtCad   = Form.fields("OBJETIVO").value();
		updtExt   = Form.fields("UPD_EXT_ADD").value();
		area      = Form.fields("AREA_ATUACAO").value();
		ciclo     = Form.fields("CICLO").value();

		Form.groups('IDENTIFICACAO').visible(false);
		Form.groups('ENDERECO').visible(false);
		Form.groups('RENDA').visible(false);
		Form.groups("EXTERNAS_ADICIONAL").visible(false);

		// Consultas externas para Abertura de Conta
		if(objtCad == "Abertura de Conta"){

			Form.fields('PONTUACAO_SCORE_TITULAR').visible(true);
			Form.fields('PONTUACAO_SCORE_TITULAR').setRequired('aprovar', true);
			Form.fields('RESTRICOES').visible(true);
			Form.fields('RESTRICOES').setRequired('aprovar', true);

			// Consultas externas procurador/rep
			if(procRep == "Sim"){

				Form.fields('SCORE_PROC_REP').visible(true);
				Form.fields('RESTRICOES_PROC_REP').visible(true);
				Form.fields('SCORE_PROC_REP').setRequired('aprovar', true);
				Form.fields('RESTRICOES_PROC_REP').setRequired('aprovar', true);

			}

		}

		// Cadastro Múltiplo
		if(modal == "Múltiplo"){

			// Grids cadastro adicional
			Form.grids("G_CAD_ADD").readOnly(true);

			// Carregar dados da grid de cadastros adicionais e consutlas externas
			var gridAdd    = Form.grids("G_CAD_ADD").dataRows();
			var gridExtAdd = Form.grids("G_EXTERNAS_ADD");

			var tamanho = Form.fields("G_EXTERNAS_ADD").dataRows().length;

			var cpfAdd  = "";
			var nomeAdd = "";
			var rlcAdd  = "";
			var civAdd  = "";
			var addTit  = "";		

			for(var i = 0; i < gridAdd.length; i ++){

				cpfAdd  = gridAdd[i].CPF_ADD;
				nomeAdd = gridAdd[i].NOME_ADD;
				rlcAdd  = gridAdd[i].RELACIONAMENTO;
				civAdd  = gridAdd[i].ESTADO_CIVIL_ADD;
				addTit  = gridAdd[i].ADD_TITULAR;

				// Caso o cônjuge seja titular da conta exigir as consultas externas
				if(addTit == "Sim"){

					// Grid consultas externas add
					Form.groups("EXTERNAS_ADICIONAL").visible(true);
					Form.grids("G_EXTERNAS_ADD").visible(true);

					// Campos consultas externas add
					Form.grids("G_EXTERNAS_ADD").fields('PONTUACAO_SCORE_ADD').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_ADD').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTRICAO_ADD').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('SCORE_CONJUGE_ADD').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('RESTRICOES_CONJUGE_ADD').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('JUST_RESTR_CON_ADD').visible(false);

					// Campos complementares
					Form.grids("G_EXTERNAS_ADD").fields('RELACIONAMENTO_EXT').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('AUX_CIVIL_ADD').visible(false);
					Form.grids("G_EXTERNAS_ADD").fields('IMPORTAR_EXT_TITULAR').visible(false);

					//Carregar variável auxiliar
					Form.fields("AUX_CAD_ADD").value("Sim").apply();

					// Inserir linhas na grid de consultas externas adicionais
					if(tamanho == 0 && updtExt == "Não"){

						gridExtAdd.insertDataRow({ CPF_EXT_ADD: cpfAdd, NOME_EXT_ADD: nomeAdd, RELACIONAMENTO_EXT: rlcAdd, AUX_CIVIL_ADD: civAdd });
						console.log("Linha inserida");

					} 					

				}

			}

			// Desabilitar campos para edição
			Form.grids("G_EXTERNAS_ADD").fields('CPF_EXT_ADD').disabled(true);
			Form.grids("G_EXTERNAS_ADD").fields('NOME_EXT_ADD').disabled(true);

			// Depois de inserir as linhas ocultar coluna do estado civil
			Form.grids("G_EXTERNAS_ADD").columns('AUX_CIVIL_ADD').visible(false);

		}

		// Cadastro Individual
		else{

			Form.groups('CADASTRO_ADICIONAL').visible(false);
			Form.groups('EXTERNAS_ADICIONAL').visible(false);

		}		

		// Atualização Cadastral
		if(tipoCad == "Atualização Cadastral"){

			Form.fields('UPDATE_RENDA').visible(true);
			Form.fields('UPDATE_RESIDENCIA').visible(true);
			Form.fields('UPDATE_CLIENTE').visible(true);
			Form.fields('UPDATE_RENDA').readOnly(true);
			Form.fields('UPDATE_RESIDENCIA').readOnly(true);
			Form.fields('UPDATE_CLIENTE').readOnly(true);	

			// Dados do cliente obrigatório para abertura de conta
			Form.fields('ESCOLARIDADE').visible(true);
			Form.fields('ESTADO_CIVIL').visible(true);
			Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
			Form.fields('ESCOLARIDADE').readOnly(true);	
			Form.fields('ESTADO_CIVIL').readOnly(true);	
			Form.fields('PROCURADOR_REPRE_LEGAL').readOnly(true);	

			// Area de atuação obrigatório para abertura de conta
			Form.groups('ENDERECO').visible(true);
			Form.fields('AREA_ATUACAO').visible(true);
			Form.fields('CIDADE').visible(false);
			Form.grids('GRD_RESIDENCIA').visible(false);			
		
			if(updtRenda == "Sim"){

				Form.groups('RENDA').visible(true);
				Form.fields('RENDA').visible(false);
				Form.groups('RENDA').grids('GRD_COMP_RENDA').disabled(true);

			}	
			if(updtResid == "Sim"){

				Form.groups('ENDERECO').visible(true);
				Form.fields('CIDADE').visible(false);
				Form.fields('AREA_ATUACAO').visible(true);
				Form.groups('ENDERECO').grids('GRD_RESIDENCIA').disabled(true);

			}		
			if(updtClint == "Sim"){

				Form.fields('CEL').visible(true);
				Form.fields('CEL_AD').visible(true);
				Form.fields('TEL').visible(true);
				Form.fields('EMAIL').visible(true);	
				Form.fields('CEL').readOnly(true);
				Form.fields('CEL_AD').readOnly(true);
				Form.fields('TEL').readOnly(true);
				Form.fields('EMAIL').readOnly(true);	
				Form.fields('REFERENCIA_UM').visible(true);
				Form.fields('CEL_TEL_REF_UM').visible(true);
				Form.fields('REFERENCIA_DOIS').visible(true);
				Form.fields('CEL_TEL_REF_DOIS').visible(true);
				Form.fields('REFERENCIA_UM').readOnly(true);
				Form.fields('CEL_TEL_REF_UM').readOnly(true);
				Form.fields('REFERENCIA_DOIS').readOnly(true);
				Form.fields('CEL_TEL_REF_DOIS').readOnly(true);
				Form.groups('IDENTIFICACAO').visible(true);
				Form.groups('IDENTIFICACAO').grids('GRD_DOCUMENTOS').readOnly(true);

			}						
			
		}

		// Cadastro Novo
		else{

			// Ocultar campos para atualização cadastral
			Form.fields('UPDATE_RENDA').visible(false);
			Form.fields('UPDATE_RESIDENCIA').visible(false);
			Form.fields('UPDATE_CLIENTE').visible(false);

			// Mostrar grupos para cadastro novo
			Form.groups('IDENTIFICACAO').visible(true);
			Form.groups('ENDERECO').visible(true);
			Form.groups('RENDA').visible(true);

			// Bloquear alterações nas GRIDS
			Form.groups('IDENTIFICACAO').grids('GRD_DOCUMENTOS').readOnly(true);
			Form.groups('RENDA').grids('GRD_COMP_RENDA').readOnly(true);
			Form.groups('ENDERECO').grids('GRD_RESIDENCIA').readOnly(true);
			Form.fields('RENDA').readOnly(true);

			// Dados do cliente obrigatórios para cadastro novo
			Form.fields('ESCOLARIDADE').visible(true);
			Form.fields('ESCOLARIDADE').readOnly(true);
			Form.fields('ESTADO_CIVIL').visible(true);
			Form.fields('ESTADO_CIVIL').readOnly(true);
			Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
			Form.fields('PROCURADOR_REPRE_LEGAL').readOnly(true);	
			Form.fields('CIDADE').visible(false);

			// Mostrar contatos e referência
			Form.fields('CEL').visible(true);
			Form.fields('CEL_AD').visible(true);
			Form.fields('TEL').visible(true);
			Form.fields('EMAIL').visible(true);
			Form.fields('REFERENCIA_UM').visible(true);
			Form.fields('CEL_TEL_REF_UM').visible(true);
			Form.fields('REFERENCIA_DOIS').visible(true);
			Form.fields('CEL_TEL_REF_DOIS').visible(true);	
			Form.fields('CEL').readOnly(true);
			Form.fields('CEL_AD').readOnly(true);
			Form.fields('TEL').readOnly(true);
			Form.fields('EMAIL').readOnly(true);
			Form.fields('REFERENCIA_UM').readOnly(true);
			Form.fields('CEL_TEL_REF_UM').readOnly(true);
			Form.fields('REFERENCIA_DOIS').readOnly(true);
			Form.fields('CEL_TEL_REF_DOIS').readOnly(true);		

		}

		// Área de atuação
		if(area == "Não"){
			
			Form.fields('CIDADE').visible(true);			
			Form.fields('CIDADE').readOnly(true);

		}		

		Form.grids("GRD_ANEXOS_COMP").fields('COMP_NOME_ADD').disabled(true);
		Form.grids("GRD_ANEXOS_COMP").fields('COMP_HORA_ADD').disabled(true);
		
		Form.actions('aprovar').disabled(true);
		Form.actions('rejeitar').disabled(true);

	}	

	if(codigoEtapa == FINALIZAR_CADASTRO || codigoEtapa == CADASTRO_SISBR_OUTRA_COOP || codigoEtapa == GERAR_CRL || codigoEtapa == ATUALIZAR_CRL || 
	   codigoEtapa == COMPLEMENTAR_CADASTRO_SISBR ||codigoEtapa == REGULARIZAR_PERFIL_CADASTRO || codigoEtapa == COMPLEM_SISBR_OUTRA_COOP){

		tipoCad   = Form.fields("TIPO_CADASTRO").value();
		modal     = Form.fields("MODALIDADE").value();
		updtRenda = Form.fields('UPDATE_RENDA').value();
		updtResid = Form.fields('UPDATE_RESIDENCIA').value();
		updtClint = Form.fields('UPDATE_CLIENTE').value();
		auxCadAdd = Form.fields('AUX_CAD_ADD').value();
		procRep   = Form.fields('PROCURADOR_REPRE_LEGAL').value();
		objtCad   = Form.fields("OBJETIVO").value();
		area      = Form.fields("AREA_ATUACAO").value();

		// Bloquear campos grid complementar
		Form.grids("GRD_ANEXOS_COMP").fields('COMP_NOME_ADD').disabled(true);
		Form.grids("GRD_ANEXOS_COMP").fields('COMP_HORA_ADD').disabled(true);

		// Ocultar grids principais
		Form.groups('IDENTIFICACAO').visible(false);
		Form.groups('ENDERECO').visible(false);
		Form.groups('RENDA').visible(false);

		// Consultas externas para Abertura de Conta
		if(objtCad == "Abertura de Conta"){

			Form.fields('PONTUACAO_SCORE_TITULAR').visible(true);
			Form.fields('PONTUACAO_SCORE_TITULAR').readOnly(true);
			Form.fields('RESTRICOES').visible(true);
			Form.fields('RESTRICOES').readOnly(true);

			// Consultas externas procurador/rep
			if(procRep == "Sim"){

				Form.fields('SCORE_PROC_REP').visible(true);
				Form.fields('RESTRICOES_PROC_REP').visible(true);
				Form.fields('SCORE_PROC_REP').readOnly(true);
				Form.fields('RESTRICOES_PROC_REP').readOnly(true);

			}

		}		
		
		// Cadastro Mútliplo
		if(modal == "Múltiplo"){

			Form.grids("G_CAD_ADD").readOnly(true);

			// Cadastro adicional é titular da conta
			if(auxCadAdd == "Sim"){

				Form.grids("G_EXTERNAS_ADD").readOnly(true);
				Form.fields('PONTUACAO_SCORE_CONJUGE').visible(true);
				Form.fields('RESTRICOES_CONJUGE').visible(true);
				Form.fields('PONTUACAO_SCORE_CONJUGE').readOnly(true);
				Form.fields('RESTRICOES_CONJUGE').readOnly(true);

				justRestConjT = Form.fields('RESTRICOES_CONJUGE').value();

				if(justRestConjT == "Restrição Impeditiva" || justRestConjT == "Restrição Aceitável"){

					Form.fields("JUSTIFICATIVA_RESTR_CON").visible(true);
					Form.fields("JUSTIFICATIVA_RESTR_CON").readOnly(true);

				}

			}

			// Cadastro adicional não é adicional da conta
			else{

				Form.groups("EXTERNAS_ADICIONAL").visible(false);

			}
			
		}

		// Cadastro Individual
		else{

			Form.groups("CADASTRO_ADICIONAL").visible(false);
			Form.groups("EXTERNAS_ADICIONAL").visible(false);
			Form.grids("G_CAD_ADD").visible(false);
			Form.grids("G_EXTERNAS_ADD").visible(false);
			Form.fields('PONTUACAO_SCORE_CONJUGE').visible(false);
			Form.fields('RESTRICOES_CONJUGE').visible(false);

		}

		// Atualização Cadastral
		if(tipoCad == "Atualização Cadastral"){

			Form.fields('UPDATE_RENDA').visible(true);
			Form.fields('UPDATE_RESIDENCIA').visible(true);
			Form.fields('UPDATE_CLIENTE').visible(true);
			Form.fields('UPDATE_RENDA').readOnly(true);
			Form.fields('UPDATE_RESIDENCIA').readOnly(true);
			Form.fields('UPDATE_CLIENTE').readOnly(true);

			if(updtRenda == "Sim"){

				Form.groups('RENDA').visible(true);
				Form.fields('RENDA').visible(false);
				Form.groups('RENDA').grids('GRD_COMP_RENDA').disabled(true);

			}	
			if(updtResid == "Sim"){

				Form.groups('ENDERECO').visible(true);
				Form.fields('CIDADE').visible(false);
				Form.fields('AREA_ATUACAO').visible(false);
				Form.groups('ENDERECO').grids('GRD_RESIDENCIA').disabled(true);

			}		
			if(updtClint == "Sim"){

				Form.groups('IDENTIFICACAO').visible(true);
				Form.groups('IDENTIFICACAO').grids('GRD_DOCUMENTOS').disabled(true);

				Form.fields('ESCOLARIDADE').visible(true);
				Form.fields('ESCOLARIDADE').readOnly(true);

				Form.fields('ESTADO_CIVIL').visible(true);
				Form.fields('ESTADO_CIVIL').readOnly(true);

				Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
				Form.fields('PROCURADOR_REPRE_LEGAL').readOnly(true);

			}						
			
		}

		// Cadastro Novo
		else{

			// Ocultar campos para atualização cadastral
			Form.fields('UPDATE_RESIDENCIA').visible(false);
			Form.fields('UPDATE_CLIENTE').visible(false);

			// Mostrar grupos para cadastro novo
			Form.groups('IDENTIFICACAO').visible(true);
			Form.groups('ENDERECO').visible(true);
			Form.groups('RENDA').visible(true);

			// Deixar as grids como somente leitura
			Form.grids("GRD_DOCUMENTOS").readOnly(true);
			Form.grids("GRD_RESIDENCIA").readOnly(true);
			Form.grids("GRD_COMP_RENDA").readOnly(true);

			// Campos obrigatórios para cadastro novo restrições
			Form.fields('CIDADE').visible(false);
			Form.fields('RENDA').readOnly(true);
			Form.fields('AREA_ATUACAO').readOnly(true);

			// Dados do cliente obrigatórios para cadastro novo
			Form.fields('ESCOLARIDADE').visible(true);
			Form.fields('ESCOLARIDADE').readOnly(true);
			Form.fields('ESTADO_CIVIL').visible(true);
			Form.fields('ESTADO_CIVIL').readOnly(true);
			Form.fields('PROCURADOR_REPRE_LEGAL').visible(true);
			Form.fields('PROCURADOR_REPRE_LEGAL').readOnly(true);	
			Form.fields('CIDADE').visible(false);

			// Mostrar contatos e referência
			Form.fields('CEL').visible(true);
			Form.fields('CEL_AD').visible(true);
			Form.fields('TEL').visible(true);
			Form.fields('EMAIL').visible(true);
			Form.fields('REFERENCIA_UM').visible(true);
			Form.fields('CEL_TEL_REF_UM').visible(true);
			Form.fields('REFERENCIA_DOIS').visible(true);
			Form.fields('CEL_TEL_REF_DOIS').visible(true);	
			Form.fields('CEL').readOnly(true);
			Form.fields('CEL_AD').readOnly(true);
			Form.fields('TEL').readOnly(true);
			Form.fields('EMAIL').readOnly(true);
			Form.fields('REFERENCIA_UM').readOnly(true);
			Form.fields('CEL_TEL_REF_UM').readOnly(true);
			Form.fields('REFERENCIA_DOIS').readOnly(true);
			Form.fields('CEL_TEL_REF_DOIS').readOnly(true);				

		}

		// Área de atuação
		if(area == "Não"){
			
			Form.fields('CIDADE').visible(true);			
			Form.fields('CIDADE').readOnly(true);

		}

		if(codigoEtapa == CADASTRO_SISBR_OUTRA_COOP || codigoEtapa == COMPLEM_SISBR_OUTRA_COOP){

			Form.actions('aprovar').disabled(true);
			Form.actions('rejeitar').disabled(true);

		}

		if(codigoEtapa == REGULARIZAR_PERFIL_CADASTRO){

			ciclo = Form.fields("CICLO").value();

			if(ciclo > 1){

				// Mostrar checkbox motivo chamado devolvido
				Form.fields('DOC_INVALIDO').visible(true);
				Form.fields('DOC_NAO_ENVIADO').visible(true);
				Form.fields('DOC_INSUFICIENTE').visible(true);
				Form.fields('FALTA_INFORMACOES').visible(true);	
				Form.fields('DOC_INVALIDO').readOnly(true);
				Form.fields('DOC_NAO_ENVIADO').readOnly(true);
				Form.fields('DOC_INSUFICIENTE').readOnly(true);
				Form.fields('FALTA_INFORMACOES').readOnly(true);

				// Comentário obrigatório caso o chamado tenha sido devolvido
				Form.fields('OBSERVACOES').setRequired('aprovar', true);

			}
			else{

				Form.groups('ACOES').visible(false);

			}

		}

		if(codigoEtapa == FINALIZAR_CADASTRO){

			Form.groups('ACOES').visible(false);

		}		

	}	

	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	// Validar anexos obrigatórios solicitar cadastro
	if(codigoEtapa == SOLICITAR_CADASTRO){

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {

			var cadastro    = Form.fields("TIPO_CADASTRO").value();
			var possuiRenda = Form.fields("RENDA").value();
			var modalCad    = Form.fields("MODALIDADE").value();
			var cpf         = Form.fields("CPF").value();
			var sqlcpf      = Form.fields("SQL_CPF").value();

			if(cadastro == "Novo Cadastro" && cpf == sqlcpf){

				console.log("Cadastro já existe");
				Form.fields('CPF').errors(['Cadastro já existe.']).apply();
				reject();
				Form.apply();

			}

			if(cadastro == "Novo Cadastro"){

				// Validar grid comprovante de renda
				if(possuiRenda == "Sim"){
					if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_COMP_RENDA", "quantidade": "1" })){
						reject();
						Form.apply();
					}
				}

				// Validar grid documentos de identificação
				if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_DOCUMENTOS", "quantidade": "1" })) {
					reject();
					Form.apply();
				}	

				// Validar grid endereço
				if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_RESIDENCIA", "quantidade": "1" })) {
					reject();
					Form.apply();
				}

			}

			if(modalCad == "Múltiplo"){

				if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "G_CAD_ADD", "quantidade": "1" })) {
					reject();
					Form.apply();
				}				

			}

			debugger;

		});

	} 

	// Validar se as consultas externas foram preenchidas
	if(codigoEtapa == REALIZAR_CADASTRO_SISBR){

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {

			var titularAdd = Form.fields("AUX_CAD_ADD").value();
			var updExtAdd  = Form.fields("UPD_EXT_ADD").value();

			if(titularAdd == "Sim" && updExtAdd == "Não"){

				Form.grids("G_EXTERNAS_ADD").errors(["Preencher as consultas externas do titular adicional!"]).apply();

				reject();
				Form.apply();

				if (!JSPadrao.adicionaErroNovo({ "grid": "G_EXTERNAS_ADD" })) {
					reject();
					Form.apply();
				}				
							
			}

			debugger;

		});		

	}

	// Validar anexos complementares perfil exceção
	if(codigoEtapa == REGULARIZAR_PERFIL_CADASTRO){
		
		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject){

			debugger;

			// Validar grid anexos complementares
			if (!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "GRD_ANEXOS_COMP", "quantidade": "1" })) {
				reject();
				Form.apply();
			}

		});

	}

	Form.apply();
}

function timeHasCome(){

	now = new Date();

	var d = now.getDate();
	var m = now.getMonth();
	var a = now.getFullYear();
	var h = now.getHours();
	var i = now.getMinutes();
	var s = now.getSeconds();

	var data = d + '/' + (m+1) + '/' + a;
	var hora = h + ':' + i + ':' + s;
	
	var data_hora = data + " às " + hora;

	return data_hora;

}