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

//Atividades do processo
var SOLICITAR_ABERTURA_CONTA = 1;
var JUSTIFICAR_ABERTURA      = 20;
var APROVAR_GERENTE 	     = 16;
var APROVAR_DIREX 			 = 18;
var ABRIR_CONTA_SISBR 		 = 6;
var GERAR_DOSSIE 			 = 5;
var COLETAR_ASSINATURAS 	 = 7;
var ANALISAR_DOSSIE 		 = 12;
var FORMALIZAR_DOSSIE_SISBR  = 11;
var CADASTRAR_CARTEIRA       = 19;
var FINALIZAR_ABERTURA       = 2;

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

	if(codigoEtapa == SOLICITAR_ABERTURA_CONTA) {

		//Valida CPF
		Form.fields("CPF").subscribe("BLUR", function (itemId, data, response) {
			var retorno = JSPadrao.validaCPF({ "campo": "CPF" });
			console.log("CPF: " + retorno);
		});

		// Mostra informações de restrição titular PF
		Form.fields("RESTRICOES").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(true).apply();
			}
			else{
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false).apply();
			}

		});	
		
		// Mostra informações de restrição titular PJ
		Form.fields("RESTRICOES_CNPJ").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
				Form.fields('JUST_RESTRICOES_CNPJ').visible(true).apply();
			}
			else{
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false).apply();
			}

		});			

		// Executa motor de regras PF
		Form.fields("NOME").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			Form.apply().then(function () {
				motorRegrasPF();
			});

		});		

		// Executa motor de regras PJ
		Form.fields("RAZAO_SOCIAL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			Form.apply().then(function () {
				motorRegrasPJ();
			});

		});			
		
		// Mostra informações do procurador / rep. legal
		Form.fields("PROCURADOR_REP").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Sim"){
				Form.fields('CPF_PROC_REP').visible(true).apply();
				Form.fields('NOME_PROC_REP').visible(true).apply();
				Form.fields('SCORE_PROCURADOR').visible(true).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('CPF_PROC_REP').visible(false).apply();
				Form.fields('NOME_PROC_REP').visible(false).apply();
				Form.fields('SCORE_PROCURADOR').visible(false).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(false).apply();
			}

		});	

		// Mostra informações do cônjuge
		Form.fields("ESTADO_CIVIL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Casado" || response == "União Estável"){
				Form.fields('CPF_CONJUGE').visible(true).apply();
				Form.fields('NOME_CONJUGE').visible(true).apply();
			}
			else{
				Form.fields('CPF_CONJUGE').visible(false).apply();
				Form.fields('NOME_CONJUGE').visible(false).apply();
			}

		});			

		// Mostra informações de restrição do procurador/rep. legal
		Form.fields("RESTRICOES_PROC_REP").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Restrição Impeditiva" || response == "Restrição Aceitável"){
				Form.fields('JUST_REST_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('JUST_REST_PROC_REP').visible(false).apply();
			}

		});			
		
		// Mostra cidade quando for fora da área PF
		Form.fields("AREA_ATUACAO").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Não"){
				Form.fields('CIDADE').visible(true).apply();
			}
			else{
				Form.fields('CIDADE').visible(false).apply();
			}

		});	
		
		// Mostra cidade quando for fora da área PJ
		Form.fields("AREA_ATUACAO_CNPJ").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			if(response == "Não"){
				Form.fields('CIDADE_CNOJ').visible(true).apply();
			}
			else{
				Form.fields('CIDADE_CNOJ').visible(false).apply();
			}

		});		

		// Mostrar campos titular PF ou PJ
		Form.fields("TIPO_PESSOA").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Pessoa Física"){

				Form.groups('DADOS_PROPNETE_TITULAR').visible(true).apply();

				// Composição da conta
				Form.fields('COMPOSICAO_CONTA').visible(true).apply();
				Form.fields("COMPOSICAO_CONTA").setRequired('aprovar', true).apply();

				// Nome e CPF bloqueado e obrigatório
				Form.fields("CPF").disabled(true).apply();
				Form.fields("NOME").disabled(true).apply();
				Form.fields("CPF").setRequired('aprovar', true).apply();
				Form.fields("NOME").setRequired('aprovar', true).apply();

				// Ocultar campos rep. legal e jsutificativas de restrição
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false).apply();
				Form.fields('CIDADE').visible(false).apply();
				Form.fields('CPF_CONJUGE').visible(false).apply();
				Form.fields('NOME_CONJUGE').visible(false).apply();
				Form.fields('JUST_REST_PROC_REP').visible(false).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(false).apply();
				Form.fields('SCORE_PROCURADOR').visible(false).apply();
				Form.fields('CPF_PROC_REP').visible(false).apply();
				Form.fields('NOME_PROC_REP').visible(false).apply();

			}
			else{

				// Ocultar campos PF
				Form.fields('COMPOSICAO_CONTA').visible(false).apply();
				Form.fields("COMPOSICAO_CONTA").setRequired('aprovar', false).apply();
				Form.fields("CPF").setRequired('aprovar', false).apply();
				Form.fields("NOME").setRequired('aprovar', false).apply();
				Form.groups('DADOS_PROPNETE_TITULAR').visible(false).apply();

				// Mostrar campos PJ
				Form.groups('GR_CNPJ').visible(true).apply();
				Form.groups('GR_OUTROS_TITU_CNPJ').visible(true).apply();

				// Razão social e CNPJ bloqueado e obrigatório
				Form.fields("RAZAO_SOCIAL").disabled(true).apply();
				Form.fields("CNPJ").disabled(true).apply();
				Form.fields("RAZAO_SOCIAL").setRequired('aprovar', true).apply();
				Form.fields("CNPJ").setRequired('aprovar', true).apply();

				// Ocultar campos PJ
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false).apply();
				Form.fields('CIDADE_CNOJ').visible(false).apply();

			}
		
		});		
		
		// Mostrar grid conta conjunta
		Form.fields("COMPOSICAO_CONTA").subscribe("CHANGE", function(itemId, data, response) {

			if(response == "Conjunta"){

				// Mostrar grupo
				Form.groups('GR_OUTROS_TITULARES').visible(true).apply();

				// Nome e CPF bloqueado e  obrigatório
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").disabled(true).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").disabled(true).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").setRequired('aprovar', true).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").setRequired('aprovar', true).apply();				

				// Ocultar campos
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_SCORE").visible(false).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_RESTRICOES").visible(false).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_JUST_REST").visible(false).apply();

			}
			else{

				Form.groups('GR_OUTROS_TITULARES').visible(false).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_NOME").setRequired('aprovar', false).apply();
				Form.grids("GRID_OUTROS_T").fields("OUTRO_TITU_CPF").setRequired('aprovar', false).apply();					

			}
		
		});			

		// Altera quando valor do campo é atualizado pela api
		Form.fields("AUX_SQL_RETORNO_SOCIOS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			debugger;

			let dadosGrid = Form.grids('OUTRO_TIT_CNPJ').dataRows();

			if (dadosGrid.length > 0) {

				//limpa informações da GRid
				let grid = Form.grids("OUTRO_TIT_CNPJ");

				grid.dataRows(function (dataRow) {
					grid.removeDataRow(dataRow.id);
				});
			}

			var listaSocios = response.split(";");

			listaSocios.forEach(function (dados) {
				debugger;

				var gridSocio = Form.grids("OUTRO_TIT_CNPJ");

				var tipoPessoa = dados.split("@")[0];
				var nomeSocio = dados.split("@")[1];
				var cpfSpcio = dados.split("@")[2];
				var restricaoSocio = dados.split("@")[3];
				var estadoCivil = dados.split("@")[4];
				var tipoSocio = dados.split("@")[5];
				var nomeConjuge = dados.split("@")[6];
				var cpfConjuge = dados.split("@")[7];
				var restricaoConjuge = dados.split("@")[8];

				//Insere Informações na Grid
				debugger;
				gridSocio.insertDataRow(
					{
						TIPO_PESSOA_SOCIO: tipoPessoa,
						OUTRO_TITU_NOME_CNPJ: nomeSocio,
						OUTRO_TITU_CPF_CNPJ: cpfSpcio,
						OUTRO_TITU_CPF_REST: restricaoSocio,
						OUTRO_TITU_CNPJ_EC: estadoCivil,
						TIPO_SOCIO: tipoSocio,
						NOME_CONJUGE_SOCIO: nomeConjuge,
						CPF_CONJUGE_SOCIO: cpfConjuge,
						OUTRO_CONJ_CNPJ_RESTRI: restricaoConjuge
					}
				);
			});

		});

		// Mostrar modalidade de cadastro
		Form.fields("AUX_MODALIDADE_CADASTRO").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			console.log(response);

		});	

		// Mostrar se o cadastro adicional será titular da conta
		Form.fields("AUX_CAD_ADD_TITULAR").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			console.log("Adicional será titular?: " + response);

		});		
		
		// Resultado select cadastros adicionais
		Form.fields("AUX_SQL_ADICIONAIS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("Adicionais: " + response);

			let dadosGrid = Form.grids('GRID_OUTROS_T').dataRows();

			// Limpar grid cadastros adicionais
			if (dadosGrid.length > 0) {

				let grid = Form.grids("GRID_OUTROS_T");

				grid.dataRows(function (dataRow) {
					grid.removeDataRow(dataRow.id);
				});

			}

			var listaCadAdd = response.split(";");

			console.log("listaCadAdd: " + listaCadAdd);

			listaCadAdd.forEach(function (dados) {

				debugger;

				// Separar resultado do select, uma coluna para cada @
				var gridCadAdd = Form.grids("GRID_OUTROS_T");

				var cpfAdd        = dados.split("@")[0];
				var nomeAdd       = dados.split("@")[1];
				var scoreAdd      = dados.split("@")[2];
				var restricoesAdd = dados.split("@")[3];
				var justRestAdd   = dados.split("@")[4];


				console.log("cpfAdd: "        + cpfAdd);
				console.log("nomeAdd: "       + nomeAdd);
				console.log("scoreAdd: "      + scoreAdd);
				console.log("restricoesAdd: " + restricoesAdd);
				console.log("justRestAdd: "   + justRestAdd);

				// Inserir cadastro adicionais na grid
				debugger;
				gridCadAdd.insertDataRow(
					{
						OUTRO_TITU_CPF:        cpfAdd,
						OUTRO_TITU_NOME:       nomeAdd,
						OUTRO_TITU_SCORE:      scoreAdd,
						OUTRO_TITU_RESTRICOES: restricoesAdd,
						OUTRO_TITU_JUST_REST:  justRestAdd
					}
				);

			});

		});	

		// Rota definida
		Form.fields("AUX_ROTEAMENTO_APOS_CRL").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {
			
			console.log("Rota definida: " + response);

		});			

	}

	Form.apply();
}

/*
 * Formata o formulário
 */
function setForm() {

	if(codigoEtapa == SOLICITAR_ABERTURA_CONTA){

		//Form.groups('AUX').visible(true).apply();
		
		Form.groups('GR_OUTROS_TITULARES').visible(false).apply();
		Form.groups('DADOS_PROPNETE_TITULAR').visible(false).apply();
		Form.groups('JUSTIFICATIVAS').visible(false).apply();
		Form.groups('GR_CNPJ').visible(false).apply();
		Form.groups('GR_OUTROS_TITU_CNPJ').visible(false).apply();
		Form.groups('GROUP6').visible(false).apply();

		// Informações da conta
		var auxTipoPessoa  = Form.fields("TIPO_PESSOA").value();
		var auxComposicao  = Form.fields("COMPOSICAO_CONTA").value();
		var auxTalao       = Form.fields("SOLICITAR_TALAO").value();
		var auxRoteamento  = Form.fields("AUX_ROTEAMENTO_APOS_CRL").value();

		// Informações conta PF
		var auxEstadoCivil = Form.fields("ESTADO_CIVIL").value();		
		var auxAreaAtuacao = Form.fields("AREA_ATUACAO").value();
		var auxRestricaoT  = Form.fields("RESTRICOES").value();	
		var auxProcurador  = Form.fields("PROCURADOR_REP").value();	
		var auxRestricaoP  = Form.fields("RESTRICOES_PROC_REP").value();
		
		// Informações conta PJ
		var auxRestricaoPJ   = Form.fields("RESTRICOES_CNPJ").value();		
		var auxAreaAtuacaoPJ = Form.fields("AREA_ATUACAO_CNPJ").value();	

		console.log("Tipo pessoa: " + auxTipoPessoa);
		console.log("Composicao: " + auxComposicao);

		// Formulário conta corrente
		if(auxTipoPessoa == "Pessoa Física"){

			Form.groups('DADOS_PROPNETE_TITULAR').visible(true).apply();
			Form.groups('GR_CNPJ').visible(false).apply();
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(false).apply();

			if(auxComposicao == "Individual"){ 
				Form.groups('GR_OUTROS_TITULARES').visible(false).apply(); 
			}
			else{ 
				Form.groups('GR_OUTROS_TITULARES').visible(true).apply(); 
			}

			if(auxEstadoCivil == "Casado" || auxEstadoCivil == "União Estável"){
				Form.fields('CPF_CONJUGE').visible(true).apply();
				Form.fields('NOME_CONJUGE').visible(true).apply();
			}
			else{
				Form.fields('CPF_CONJUGE').visible(false).apply();
				Form.fields('NOME_CONJUGE').visible(false).apply();
			}

			if(auxProcurador == "Sim"){
				Form.fields('CPF_PROC_REP').visible(true).apply();
				Form.fields('NOME_PROC_REP').visible(true).apply();
				Form.fields('SCORE_PROCURADOR').visible(true).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('CPF_PROC_REP').visible(false).apply();
				Form.fields('NOME_PROC_REP').visible(false).apply();
				Form.fields('SCORE_PROCURADOR').visible(false).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(false).apply();
			}	
			
			if(auxAreaAtuacao == "Não"){
				Form.fields('CIDADE').visible(true).apply();
			}
			else{
				Form.fields('CIDADE').visible(false).apply();
			}	
			
			if(auxRestricaoT == "Restrição Impeditiva" || auxRestricaoT == "Restrição Aceitável"){
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(true).apply();
			}
			else{
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false).apply();
			}	
			
			if(auxRestricaoP == "Restrição Impeditiva" || auxRestricaoP == "Restrição Aceitável"){
				Form.fields('JUST_REST_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('JUST_REST_PROC_REP').visible(false).apply();
			}		

		}
		else if(auxTipoPessoa == "Pessoa Jurídica"){

			Form.groups('GR_CNPJ').visible(true).apply();
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(true).apply();	
			Form.groups('DADOS_PROPNETE_TITULAR').visible(false).apply();	
			Form.groups('GR_OUTROS_TITULARES').visible(false).apply();	
			Form.fields('COMPOSICAO_CONTA').visible(false).apply();

			if(auxAreaAtuacaoPJ == "Não"){
				Form.fields('CIDADE_CNOJ').visible(true).apply();
			}
			else{
				Form.fields('CIDADE_CNOJ').visible(false).apply();
			}	
			
			if(auxRestricaoPJ == "Restrição Impeditiva" || auxRestricaoPJ == "Restrição Aceitável"){
				Form.fields('JUST_RESTRICOES_CNPJ').visible(true).apply();
			}
			else{
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false).apply();
			}			

		}		

	}

	if(codigoEtapa == APROVAR_GERENTE || codigoEtapa == APROVAR_DIREX || codigoEtapa == ABRIR_CONTA_SISBR || codigoEtapa == GERAR_DOSSIE || codigoEtapa == COLETAR_ASSINATURAS || 
	   codigoEtapa == ANALISAR_DOSSIE || codigoEtapa == FORMALIZAR_DOSSIE_SISBR || codigoEtapa == CADASTRAR_CARTEIRA || codigoEtapa == FINALIZAR_ABERTURA || codigoEtapa == JUSTIFICAR_ABERTURA){

		// Informações da conta
		var auxTipoPessoa  = Form.fields("TIPO_PESSOA").value();
		var auxComposicao  = Form.fields("COMPOSICAO_CONTA").value();
		var auxTalao       = Form.fields("SOLICITAR_TALAO").value();
		var auxRoteamento  = Form.fields("AUX_ROTEAMENTO_APOS_CRL").value();

		// Informações conta PF
		var auxEstadoCivil = Form.fields("ESTADO_CIVIL").value();		
		var auxAreaAtuacao = Form.fields("AREA_ATUACAO").value();
		var auxRestricaoT  = Form.fields("RESTRICOES").value();	
		var auxProcurador  = Form.fields("PROCURADOR_REP").value();	
		var auxRestricaoP  = Form.fields("RESTRICOES_PROC_REP").value();
		
		// Informações conta PJ
		var auxRestricaoPJ   = Form.fields("RESTRICOES_CNPJ").value();		
		var auxAreaAtuacaoPJ = Form.fields("AREA_ATUACAO_CNPJ").value();	

		// Formulário conta corrente
		if(auxTipoPessoa == "Pessoa Física"){

			Form.groups('GR_CNPJ').visible(false).apply();
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(false).apply();

			if(auxComposicao == "Individual"){ 
				Form.groups('GR_OUTROS_TITULARES').visible(false).apply(); 
			}
			else{ 
				Form.groups('GR_OUTROS_TITULARES').visible(true).apply(); 
			}

			if(auxEstadoCivil == "Casado" || auxEstadoCivil == "União Estável"){
				Form.fields('CPF_CONJUGE').visible(true).apply();
				Form.fields('NOME_CONJUGE').visible(true).apply();
			}
			else{
				Form.fields('CPF_CONJUGE').visible(false).apply();
				Form.fields('NOME_CONJUGE').visible(false).apply();
			}

			if(auxProcurador == "Sim"){
				Form.fields('CPF_PROC_REP').visible(true).apply();
				Form.fields('NOME_PROC_REP').visible(true).apply();
				Form.fields('SCORE_PROCURADOR').visible(true).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('CPF_PROC_REP').visible(false).apply();
				Form.fields('NOME_PROC_REP').visible(false).apply();
				Form.fields('SCORE_PROCURADOR').visible(false).apply();
				Form.fields('RESTRICOES_PROC_REP').visible(false).apply();
			}	
			
			if(auxAreaAtuacao == "Não"){
				Form.fields('CIDADE').visible(true).apply();
			}
			else{
				Form.fields('CIDADE').visible(false).apply();
			}	
			
			if(auxRestricaoT == "Restrição Impeditiva" || auxRestricaoT == "Restrição Aceitável"){
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(true).apply();
			}
			else{
				Form.fields('JUSTIFICATIVA_RESTRICAO').visible(false).apply();
			}	
			
			if(auxRestricaoP == "Restrição Impeditiva" || auxRestricaoP == "Restrição Aceitável"){
				Form.fields('JUST_REST_PROC_REP').visible(true).apply();
			}
			else{
				Form.fields('JUST_REST_PROC_REP').visible(false).apply();
			}		

		}
		else{

			Form.groups('GR_CNPJ').visible(true).apply();
			Form.groups('GR_OUTROS_TITU_CNPJ').visible(true).apply();	
			Form.groups('DADOS_PROPNETE_TITULAR').visible(false).apply();	
			Form.groups('GR_OUTROS_TITULARES').visible(false).apply();	
			Form.fields('COMPOSICAO_CONTA').visible(false).apply();

			if(auxAreaAtuacaoPJ == "Não"){
				Form.fields('CIDADE_CNOJ').visible(true).apply();
			}
			else{
				Form.fields('CIDADE_CNOJ').visible(false).apply();
			}	
			
			if(auxRestricaoPJ == "Restrição Impeditiva" || auxRestricaoPJ == "Restrição Aceitável"){
				Form.fields('JUST_RESTRICOES_CNPJ').visible(true).apply();
			}
			else{
				Form.fields('JUST_RESTRICOES_CNPJ').visible(false).apply();
			}			

		}

		if(codigoEtapa == JUSTIFICAR_ABERTURA){

			// Fora da área sem restrição
			if(auxRoteamento == "Preencher Parecer"){

				Form.groups('JUSTIFICATIVAS').visible(true).apply();
				Form.fields("PARECER").setRequired('aprovar', true).apply();
				Form.fields('OBS_REFERENCIAS').visible(false).apply();

			}
			// Possui restrição
			else if(auxRoteamento == "Preencher Parecer e Referências"){

				Form.groups('JUSTIFICATIVAS').visible(true).apply();
				Form.fields("OBS_REFERENCIAS").setRequired('aprovar', true).apply();				
				Form.fields("PARECER").setRequired('aprovar', true).apply();
				
			}
			// Dentro da área sem restrição
			else if(auxRoteamento == "Aprovar Abertura de Conta - Gerente"){

				Form.groups('JUSTIFICATIVAS').visible(false).apply();
				Form.fields("PARECER").setRequired('aprovar', false).apply();
				Form.fields("OBS_REFERENCIAS").setRequired('aprovar', false).apply();				

			}		
		
		}

		else if(codigoEtapa != JUSTIFICAR_ABERTURA){

			// Justificativas abertura de conta
			if(auxRoteamento == "Preencher Parecer"){
				Form.fields('OBS_REFERENCIAS').visible(false).apply();
				Form.fields('PARECER').visible(true).apply();
			}
			else if(auxRoteamento == "Preencher Parecer e Referências"){
				Form.fields('OBS_REFERENCIAS').visible(true).apply();
				Form.fields('PARECER').visible(true).apply();
			}
			else if(auxRoteamento == "Aprovar Abertura de Conta - Gerente"){
				Form.groups('JUSTIFICATIVAS').visible(false).apply();				
			}		

		}

		// Informações talão
		if(auxTalao == "Sim" && codigoEtapa != APROVAR_GERENTE){
			Form.fields('QTD_FOLHAS').visible(true).apply();
			Form.fields('TALAO_APROVADO').visible(true).apply();
		}
		else if(auxTalao == "Não" && codigoEtapa != APROVAR_GERENTE){
			Form.fields('QTD_FOLHAS').visible(false).apply();
			Form.fields('TALAO_APROVADO').visible(false).apply();
		}		

	}

	Form.apply();

}

/*
 * Define novas regras de validação dos campos
 */
function setValidators() {

	// Executar motor de regras na aprovação da etapa
	if(codigoEtapa == SOLICITAR_ABERTURA_CONTA) {
		var REJEITAR = true;
		
		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
			if (REJEITAR) {
				if (Form.fields("TIPO_PESSOA").value() == "Pessoa Física"){
					retorno = motorRegrasPF();
				}else{
					retorno = motorRegrasPJ();
				}			
				if (retorno == "") {
					reject();
				} else {
					REJEITAR = false;
					reject();
					Form.actions("aprovar").execute();
				}
			}
		});
	}

}

function motorRegrasPJ(){
	debugger;

	var scoreCNPJ = Form.fields("PONTUACAO_SCORE_CNPJ").value();
	var restricaoCNPJ = Form.fields("RESTRICOES_CNPJ").value();
	var areaAtuacaoCNPJ = Form.fields("AREA_ATUACAO_CNPJ").value();
	var roteamentoPJ = "";

	console.log("####  - Informações Titulares Principal  - #####");
	console.log("Score CNPJ : " + scoreCNPJ);
	console.log("Restricao CNPJ : " + restricaoCNPJ);
	console.log("Area Atuacao PJ: " + areaAtuacaoCNPJ);


	//scoreCNPJ >= 300 (Aprovação Gerente) || restricaoCNPJ != Restrição Impeditiva (Aprovação Gerente)	
	if (scoreCNPJ >= 300 &&
		restricaoCNPJ != "Restrição Impeditiva" &&
		areaAtuacaoCNPJ == "Sim") {
		roteamento = "Aprovar Abertura de Conta - Gerente";
	}

	//ScoreCNPJ < 300 (Parecer + Aprovação Gerente + Aprovação Superintendente)  || //areaAtuacaoCNPJ == Não (Parecer + Aprovação Direx)
	else if ((scoreCNPJ < 300 && (restricaoCNPJ != "Restrição Impeditiva" && restricaoCNPJ != "" && restricaoCNPJ != undefined)) ||
		(restricaoCNPJ != "Restrição Impeditiva" && restricaoCNPJ != "" && restricaoCNPJ != undefined && areaAtuacaoCNPJ == "Não")) {
		roteamento = "Preencher Parecer";
	}

	//RestricaoCNPJ == Restrição Impeditiva (Referências + Parecer + Aprovação Gerente + Aprovação Superintendente)
	else if (restricaoCNPJ == "Restrição Impeditiva") {
		roteamento = "Preencher Parecer e Referências";
	}


	var gridSocios= Form.grids("OUTRO_TIT_CNPJ").dataRows();

	for (var i = 0; i < gridSocios.length; i++) {

		debugger;
		var estadoCivilSocio = gridSocios[i].OUTRO_TITU_CNPJ_EC;
		var restricaoSocio = gridSocios[i].OUTRO_TITU_CPF_REST;
		var restricaoConjugeSocio = gridSocios[i].OUTRO_CONJ_CNPJ_RESTRI;

		console.log("####  - Informações Outros Titulares  - #####");
		console.log("Posição Grid " + i);
		console.log("Estado Civil Socio: " + estadoCivilSocio);
		console.log("Restricao Socio: " + restricaoSocio);
		console.log("Restricao Conjuge Socio: " + restricaoConjugeSocio);


		if (estadoCivilSocio != "Casado" && estadoCivilSocio != "União Estável") {

			//restricaoSocio != Restrição Impeditiva (Aprovação Gerente)
			if (restricaoSocio != "Restrição Impeditiva") {

				//Valida se a validação anterior é igual a Preencher Parecer e Referências
				if (roteamento == "Preencher Parecer e Referências") {
					roteamento = "Preencher Parecer e Referências";
				}
				//Valida se a validação anterior é igual a Preencher Parecer
				else if (roteamento == "Preencher Parecer") {
					roteamento = "Preencher Parecer";
				}
				//Se não foi enquadrada nos niveis maiores entra na validação real
				else {
					roteamento = "Aprovar Abertura de Conta - Gerente";
				}
			}

			//restricaoSocio == Restrição Impeditiva (Referências + Parecer + Aprovação Gerente + Aprovação Superintendente)
			else if (restricaoSocio == "Restrição Impeditiva") {
				roteamento = "Preencher Parecer e Referências";
			}

		}

		else if (estadoCivilSocio == "Casado" || estadoCivilSocio == "União Estável") {

			//restricaoConjugeSocio != Restrição Impeditiva (Aprovação Gerente)
			if ((restricaoSocio != "Restrição Impeditiva" && restricaoSocio != "" && restricaoSocio != undefined) &&
				(restricaoConjugeSocio != "Restrição Impeditiva" && restricaoConjugeSocio != "" && restricaoConjugeSocio != undefined)) {

				//Valida se a validação anterior é igual a Preencher Parecer e Referências
				if (roteamento == "Preencher Parecer e Referências") {
					roteamento = "Preencher Parecer e Referências";
				}
				//Valida se a validação anterior é igual a Preencher Parecer
				else if (roteamento == "Preencher Parecer") {
					roteamento = "Preencher Parecer";
				}
				//Se não foi enquadrada nos niveis maiores entra na validação real
				else {
					roteamento = "Aprovar Abertura de Conta - Gerente";
				}
			}

			//restricaoConjugeSocio == Restrição Impeditiva (Referências + Parecer + Aprovação Gerente + Aprovação Superintendente)
			else if (restricaoSocio == "Restrição Impeditiva" || restricaoConjugeSocio == "Restrição Impeditiva") {
				//titual ou Conjuge COM restrição impeditiva
				roteamento = "Preencher Parecer e Referências";
			}
		}


		console.log("Tipo de Rota: " + roteamento);
		console.log("");

		if (roteamento == "Preencher Parecer e Referências") {
			break;
		}
	}

	Form.fields("AUX_ROTEAMENTO_APOS_CRL").value(roteamento);

	Form.apply();

	return roteamento;
}

function motorRegrasPF() {

	debugger;

	var restricaoTitular = Form.fields("RESTRICOES").value();
	var possuiProcRep    = Form.fields("PROCURADOR_REP").value();
	var restricaoProcRep = Form.fields("RESTRICOES_PROC_REP").value();
	var areaAtuacao      = Form.fields("AREA_ATUACAO").value();
	var composicaoConta  = Form.fields("COMPOSICAO_CONTA").value();
	var roteamento       = "";

	console.log("Composição da conta: "        + composicaoConta);
	console.log("Restricoes titular: "         + restricaoTitular);
	console.log("Possui proc/rep. legal?: "    + possuiProcRep);
	console.log("Restricoes proc/rep. legal: " + restricaoProcRep);
	console.log("Area de atuação: "            + areaAtuacao);

	// Titular sem procurador/rep. legal
	if (possuiProcRep == "Não") {

		console.log("Não possui procurador");

		// Titular sem restrição dentro da área - não exige parecer e referência
		if (restricaoTitular != "Restrição Impeditiva" && areaAtuacao == "Sim") { 
			
			console.log("Titular sem restrição dentro da área");
			roteamento = "Aprovar Abertura de Conta - Gerente"; 
		
		}

		// Titular sem restrição fora da área - exige parecer
		else if (restricaoTitular != "Restrição Impeditiva" && areaAtuacao == "Não") { 
			
			console.log("Titular sem restrição fora da área");
			roteamento = "Preencher Parecer"; 
		
		}

		// Titular com restrição - exige parecer e referências
		else if (restricaoTitular == "Restrição Impeditiva") { 
			
			console.log("Titular com restrição");
			roteamento = "Preencher Parecer e Referências"; 
		
		}

	}

	// Titular com procurador/rep. legal
	else if (possuiProcRep == "Sim") {

		console.log("Possui procurador");

		// Titular e procurador sem restrição dentro da área - não exige parecer e referência
		if ((restricaoTitular != "Restrição Impeditiva" && restricaoProcRep != "Restrição Impeditiva") && areaAtuacao == "Sim") {

			console.log("Procurador e titular sem restrição dentro da área");
			roteamento = "Aprovar Abertura de Conta - Gerente";
		}

		// Titular e procurador sem restrição fora da área - exige parecer
		else if ((restricaoTitular != "Restrição Impeditiva" && restricaoProcRep != "Restrição Impeditiva") && areaAtuacao == "Não") {

			console.log("Procurador e titular sem restrição fora da área");
			roteamento = "Preencher Parecer";
		}

		// Titular ou procurador com restrição - exige parecer e referências
		else if (restricaoTitular == "Restrição Impeditiva" || restricaoProcRep == "Restrição Impeditiva") {
			
			console.log("Procurador ou titular com restrição");
			roteamento = "Preencher Parecer e Referências";
		}

	}

	console.log("Tipo de Rota - Final da Validação Titular Principal: " + roteamento);

	if (roteamento != "Preencher Parecer e Referências") {

		if (composicaoConta == "Conjunta") {

			console.log("Início Validação Titulares Adicionais");

			var gridOutrosTitutlares = Form.grids("GRID_OUTROS_T").dataRows();

			for (var i = 0; i < gridOutrosTitutlares.length; i++) {

				var restricaoTitularAdd = gridOutrosTitutlares[i].OUTRO_TITU_RESTRICOES;

				console.log("Linha: " + i);
				console.log("Restricao Titular Adicional: " + restricaoTitularAdd);

				// Titular adicional sem restrição
				if (restricaoTitularAdd != "Restrição Impeditiva") {

					// Valida se a validação anterior é igual a Preencher Parecer e Referências
					if (roteamento == "Preencher Parecer e Referências") {
						roteamento = "Preencher Parecer e Referências";
					}
					// Valida se a validação anterior é igual a Preencher Parecer
					else if (roteamento == "Preencher Parecer") {
						roteamento = "Preencher Parecer";
					}
					// Se não foi enquadrada nos niveis maiores entra na validação real
					else {
						roteamento = "Aprovar Abertura de Conta - Gerente";
					}
				}

				// Titular adicional com restrição
				else if (restricaoTitularAdd == "Restrição Impeditiva") {
					roteamento = "Preencher Parecer e Referências";
				}

				console.log("Tipo de Rota - Final da Validação Titulares Adicionais: " + roteamento);

				// Interromper validação caso seja identificado algum titular com restrição
				if (roteamento == "Preencher Parecer e Referências") { break; }

			}

			console.log("Fim da Validação Titulares Adicionais");
			
		}

	}

	Form.fields("AUX_ROTEAMENTO_APOS_CRL").value(roteamento);
	Form.apply();

	return roteamento;

}