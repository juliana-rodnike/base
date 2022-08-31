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
var DEFINIR_CATEGORIA    = 14;
var COMPLEMENTAR_CHAMADO = 5;
var ASSUMIR_NOVO         = 10;
var REDIRECIONAR_CHAMADO = 12;
var REALIZAR_ATENDIMENTO = 1;
var ASSUMIR_INTERNO      = 11;
var AGUARDANDO_TERCEIROS = 4;
var APROVACAO_ALCADA_2   = 8;
var APROVACAO_ALCADA_3   = 9;
var FINALIZAR_APROVADO   = 2;
var FINALIZAR_CANCELADO  = 6;
var ORIGEM_UAD           = "";

var auxGrupo = "";
var auxCat   = "";
var auxSub   = "";
var modelo   = "";

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
	auxGrupo = "";
	auxCat   = "";
	auxSub   = "";
	modelo   = Form.fields("AUX_MODELO").value();

	if(codigoEtapa == DEFINIR_CATEGORIA) {

		// Atualizar responsável pelo atendimento
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {
			
			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();

		});	

		// Atualizar responsável pelo atendimento
		Form.fields("DESTINO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();

		});			

		// Limpar subcategorias anteriores
		Form.fields("CATEGORIA").subscribe("CLICK", function(itemId, data, response) {

			Form.fields("SUBCATEGORIA").removeOptions([]).apply();
			listaCategorias(auxGrupo);

		});

		// Carregar subcategorias referente ao modelo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();

			if(modelo == "99 - Administrativo")     { subcategoriasAdministrativo(auxCat); } else
			if(modelo == "99 - Agência Virtual")    { subcategoriasAgenciaVirtual(auxCat); } else
			if(modelo == "99 - Adquirencia")        { subcategoriasAdquirencia   (auxCat); } else
			if(modelo == "99_cons_consig")          { subcategoriasConsorcio     (auxCat); } else
			if(modelo == "99_cadastro")             { subcategoriasCadastro      (auxCat); } else
			if(modelo == "99 - Câmbio")             { subcategoriasCambio        (auxCat); } else
			if(modelo == "99 - Cartões")            { subcategoriasCartoes       (auxCat); } else
			if(modelo == "99 - Cobrança Bancária")  { subcategoriasCobranca      (auxCat); } else
			if(modelo == "99 - Cobrança Adm")       { subcategoriasCobrancaAdm   (auxCat); } else
			if(modelo == "99 - Compensação")        { subcategoriasCompensacao   (auxCat); } else
			if(modelo == "99 - Conectividade")      { subcategoriasConectividade (auxCat); } else
			if(modelo == "99 - Contabilidade")      { subcategoriasContabilidade (auxCat); } else
			if(modelo == "99 - Contas a Pagar")     { subcategoriasContasPagar   (auxCat); } else
			if(modelo == "99 - Correspondente")     { subcategoriasCorrespondente(auxCat); } else
			if(modelo == "99 - Crédito Comercial")  { subcategoriasCredito       (auxCat); } else
			if(modelo == "99 - Crédito Rural")      { subcategoriasRural         (auxCat); } else
			if(modelo == "99 - Governança")         { subcategoriasGovernanca    (auxCat); } else
			if(modelo == "99 - Marketing")          { subcategoriasMarketing     (auxCat); } else
			if(modelo == "99 - Processos")          { subcategoriasProcessos     (auxCat); } else
			if(modelo == "99 - PLD")                { subcategoriasPLD           (auxCat); } else
			if(modelo == "99 - RH")                 { subcategoriasRH            (auxCat); } else
			if(modelo == "99 - Seguros")            { subcategoriasSeguro        (auxCat); } else
			if(modelo == "99 - Tecnologia")         { subcategoriasTecnologia    (auxCat); } else
			if(modelo == "99 - Tesouraria")         { subcategoriasTesouraria    (auxCat); } 

		});

		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			auxSub    = Form.fields("SUBCATEGORIA").value();
			auxLider  = Form.fields("AUX_LIDER").value();
			iniciador = Form.fields("AUX_INICIADOR").value();

			if(iniciador != auxLider){ categoriaAprovaGerente(modelo, auxCat, auxSub); }

			if(auxCat == "CRL" && auxSub == "Produtos e Serviços"){ 
				
				novoGrupo = "99_cartoes";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
				console.log("Novo grupo: " + novoGrupo);
			
			}
			else{
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();		
			console.log("Vai para: " + auxGrupo);	
			}
		});	
		
		console.log("Vai para final: " + auxGrupo);		
		
	}

	if(codigoEtapa == REDIRECIONAR_CHAMADO){	
		
		Form.fields("DESTINO").subscribe("CLICK", function(itemId, data, response) {
			
			Form.fields("CATEGORIA").value("").apply();
			Form.fields("SUBCATEGORIA").value("").apply();
			Form.fields("CATEGORIA").removeOptions([]);	
			Form.fields("SUBCATEGORIA").removeOptions([]);	

		});

		// Definir novo destino e atualizar grupo de responsáveis - Chamado novo
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {
			
			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();
			listaCategorias(auxGrupo);

		});	

		// Limpar subcategorias se alterar a categoria
		Form.fields("CATEGORIA").subscribe("CLICK", function(itemId, data, response) {
			
			Form.fields("SUBCATEGORIA").removeOptions([]);	
			listaCategorias(auxGrupo);
		
		});			
		
		// Carregar subcategorias referente ao grupo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();	
			listaSubcategorias(auxGrupo, auxCat);
		
		});		
		
		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();

			if(auxCat == "CRL" && auxSub == "Produtos e Serviços"){ 
				
				novoGrupo = "99_cartoes";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
				console.log("Novo grupo: " + novoGrupo);
			
			}
			else{
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();		
			console.log("Vai para: " + auxGrupo);	
			}
		});	
		
		console.log("Vai para final: " + auxGrupo);

	}

	if(codigoEtapa == REALIZAR_ATENDIMENTO){

		// Definir novo destino e atualizar grupo de responsáveis - Chamado novo
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("").apply();
			Form.fields("CATEGORIA").clear().apply();	
			Form.fields("SUBCATEGORIA").clear().apply();

			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();

		});	

		// Limpar subcategorias se alterar a categoria
		Form.fields("CATEGORIA").subscribe("CLICK", function(itemId, data, response) {

			Form.fields("SUBCATEGORIA").removeOptions([]);

			console.log("Aux grupo: " + auxGrupo);
			console.log("Aux model: " + modelo);

			if(auxGrupo.toString().substring(0,2) == "99"){
				listaCategorias(auxGrupo);
			}
			if(auxGrupo.toString().substring(0,2) != "99"){
				listaCategorias(modelo);
			}
		
		});			
		
		// Carregar subcategorias referente ao grupo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();	

			if(auxGrupo.toString().substring(0,2) == "99"){
				listaSubcategorias(auxGrupo, auxCat);
			}
			if(auxGrupo.toString().substring(0,2) != "99"){
				listaSubcategorias(modelo, auxCat);
			}
		
		});		
		
		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();

			if(auxCat == "CRL" && auxSub == "Produtos e Serviços"){ 
				
				novoGrupo = "99_cartoes";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
				console.log("Novo grupo: " + novoGrupo);
			
			}
			else{
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();		
			console.log("Vai para: " + auxGrupo);	
			}
		});	
		
		console.log("Vai para final: " + auxGrupo);	

		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota  = Form.fields("AUX_ROTA").value();
			auxGrupo = Form.fields("DESTINO").value();
			
			if(auxGrupo == "99_administrativo" && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_adm_alc_2").apply(); } else
			if(auxGrupo == "99_agenciavirtual" && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_agv_alc_2").apply(); } else
			if(auxGrupo == "99_adquirencia"    && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_adq_alc_2").apply(); } else
			if(auxGrupo == "99_cons_consig"    && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_ccp_alc_2").apply(); } else
			if(auxGrupo == "99_cadastro"       && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cdt_alc_2").apply(); } else
			if(auxGrupo == "99_cambio"         && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cmb_alc_2").apply(); } else
			if(auxGrupo == "99_cartoes"        && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_crt_alc_2").apply(); } else
			if(auxGrupo == "99_cob_adm"        && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cba_alc_2").apply(); } else
			if(auxGrupo == "99_cobranca"       && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cbb_alc_2").apply(); } else
			if(auxGrupo == "99_compensascao"   && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cmp_alc_2").apply(); } else
			if(auxGrupo == "99_conectividade"  && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cnt_alc_2").apply(); } else
			if(auxGrupo == "99_contabilidade"  && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_ctb_alc_2").apply(); } else
			if(auxGrupo == "99_contas_pagar"   && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cpg_alc_2").apply(); } else
			if(auxGrupo == "99_correspondente" && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_cor_alc_2").apply(); } else
			if(auxGrupo == "99_credito"        && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_crd_alc_2").apply(); } else
			if(auxGrupo == "99_rural"          && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_crr_alc_2").apply(); } else
			if(auxGrupo == "99_governanca"     && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_gov_alc_2").apply(); } else
			if(auxGrupo == "99_marketing"      && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_mkt_alc_2").apply(); } else
			if(auxGrupo == "99_processos"      && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_prc_alc_2").apply(); } else
			if(auxGrupo == "99_pld"            && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_pld_alc_2").apply(); } else
			if(auxGrupo == "99_rh"             && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_rhg_alc_2").apply(); } else
			if(auxGrupo == "99_seguros"        && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_seg_alc_2").apply(); } else
			if(auxGrupo == "99_tecnologia"     && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_tec_alc_2").apply(); } else
			if(auxGrupo == "99_tesouraria"     && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_tes_alc_2").apply(); }

			if(auxRota == "Finalizar Atendimento" || auxRota == "Encaminhar Chamado" || auxRota == "Submeter Alçada Nível 2" || auxRota == "Aguardando Terceiros"){
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();
			}
			if(auxRota == "Devolver ao Solicitante"){
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();
			}

		});

	}	

	if(codigoEtapa == APROVACAO_ALCADA_2){

		// Definir novo destino e atualizar grupo de responsáveis - Chamado novo
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {
			
			Form.fields("CATEGORIA").clear().apply();	
			Form.fields("SUBCATEGORIA").clear().apply();		

			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();
			Form.fields("AUX_ROTA").value("").apply();

		});	

		// Limpar subcategorias se alterar a categoria
		Form.fields("CATEGORIA").subscribe("CLICK", function(itemId, data, response) {
			
			Form.fields("SUBCATEGORIA").removeOptions([]);	
			listaCategorias(auxGrupo);
		
		});	
		
		// Carregar subcategorias referente ao grupo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();	
			listaSubcategorias(auxGrupo, auxCat);
		
		});	

		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();

			if(auxCat == "CRL" && auxSub == "Produtos e Serviços"){ 
				
				novoGrupo = "99_cartoes";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
			
			}
			else{ Form.fields("AUX_GRUPO").value(auxGrupo).apply();	}
		});		

		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota  = Form.fields("AUX_ROTA").value();
			auxGrupo = Form.fields("DESTINO").value();
			
			if(auxGrupo == "99_administrativo" && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_adm_alc_3").apply(); } else
			if(auxGrupo == "99_agenciavirtual" && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_agv_alc_3").apply(); } else
			if(auxGrupo == "99_adquirencia"    && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_adq_alc_3").apply(); } else
			if(auxGrupo == "99_cons_consig"    && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_ccp_alc_3").apply(); } else
			if(auxGrupo == "99_cadastro"       && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cdt_alc_3").apply(); } else
			if(auxGrupo == "99_cambio"         && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cmb_alc_3").apply(); } else
			if(auxGrupo == "99_cartoes"        && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_crt_alc_3").apply(); } else
			if(auxGrupo == "99_cob_adm"        && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cba_alc_3").apply(); } else
			if(auxGrupo == "99_cobranca"       && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cbb_alc_3").apply(); } else
			if(auxGrupo == "99_compensascao"   && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cmp_alc_3").apply(); } else
			if(auxGrupo == "99_conectividade"  && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cnt_alc_3").apply(); } else
			if(auxGrupo == "99_contabilidade"  && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_ctb_alc_3").apply(); } else
			if(auxGrupo == "99_contas_pagar"   && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cpg_alc_3").apply(); } else
			if(auxGrupo == "99_correspondente" && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_cor_alc_3").apply(); } else
			if(auxGrupo == "99_credito"        && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_crd_alc_3").apply(); } else
			if(auxGrupo == "99_rural"          && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_crr_alc_3").apply(); } else
			if(auxGrupo == "99_governanca"     && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_gov_alc_3").apply(); } else
			if(auxGrupo == "99_marketing"      && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_mkt_alc_3").apply(); } else
			if(auxGrupo == "99_processos"      && auxRota == "Submeter Alçada Nível 2"){ Form.fields("ALCADA_NIVEL2").value("99_prc_alc_3").apply(); } else			
			if(auxGrupo == "99_pld"            && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_pld_alc_3").apply(); } else
			if(auxGrupo == "99_rh"             && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_rhg_alc_3").apply(); } else
			if(auxGrupo == "99_seguros"        && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_seg_alc_3").apply(); } else
			if(auxGrupo == "99_tecnologia"     && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_tec_alc_3").apply(); } else
			if(auxGrupo == "99_tesouraria"     && auxRota == "Submeter Alçada Nível 3"){ Form.fields("ALCADA_NIVEL3").value("99_tes_alc_3").apply(); } 

			if(auxRota == "Aprovar Solicitação" || auxRota == "Submeter Alçada Nível 3"){
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();
			}
			if(auxRota == "Rejeitar Solicitação"){
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();
			}			

		});		

	}	

	if(codigoEtapa == APROVACAO_ALCADA_3){

		Form.fields("DESTINO").subscribe("CLICK", function(itemId, data, response) {
			
			Form.fields("CATEGORIA").value("").apply();
			Form.fields("SUBCATEGORIA").value("").apply();
			Form.fields("CATEGORIA").removeOptions([]);	
			Form.fields("SUBCATEGORIA").removeOptions([]);	

		});

		// Definir novo destino e atualizar grupo de responsáveis - Chamado novo
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {
			
			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();
			listaCategorias(auxGrupo);

		});	

		// Limpar subcategorias se alterar a categoria
		Form.fields("CATEGORIA").subscribe("CLICK", function(itemId, data, response) {
			
			Form.fields("SUBCATEGORIA").removeOptions([]);	
			listaCategorias(auxGrupo);
		
		});			
		
		// Carregar subcategorias referente ao grupo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();	
			listaSubcategorias(auxGrupo, auxCat);
		
		});	

		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();

			if(auxCat == "CRL" && auxSub == "Produtos e Serviços"){ 
				
				novoGrupo = "99_cartoes";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
				console.log(novoGrupo);
			
			}else 
			if(modelo == "99 - Crédito Comercial" && auxSub != "Produtos e Serviços"){

				novoGrupo = "99_credito";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
				console.log(novoGrupo);				

			}			

		});			

	}
	
	if(codigoEtapa == AGUARDANDO_TERCEIROS){

		// Definir novo destino e atualizar grupo de responsáveis - Chamado novo
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("").apply();
			Form.fields("CATEGORIA").clear().apply();	
			Form.fields("SUBCATEGORIA").clear().apply();

			auxGrupo = Form.fields("DESTINO").value();
			Form.fields("AUX_GRUPO").value(auxGrupo).apply();

		});	

		// Limpar subcategorias se alterar a categoria
		Form.fields("CATEGORIA").subscribe("CLICK", function(itemId, data, response) {

			Form.fields("SUBCATEGORIA").removeOptions([]);

			if(auxGrupo.toString().substring(0,2) == "99"){
				listaCategorias(auxGrupo);
			}
			if(auxGrupo.toString().substring(0,2) != "99"){
				listaCategorias(modelo);
			}
		
		});			
		
		// Carregar subcategorias referente ao grupo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();	

			if(auxGrupo.toString().substring(0,2) == "99"){
				listaSubcategorias(auxGrupo, auxCat);
			}
			if(auxGrupo.toString().substring(0,2) != "99"){
				listaSubcategorias(modelo, auxCat);
			}
		
		});		
		
		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();

			if(auxCat == "CRL" && auxSub == "Produtos e Serviços"){ 
				
				novoGrupo = "99_cartoes";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
			
			}
			else{ Form.fields("AUX_GRUPO").value(auxGrupo).apply();	}
		});	
		
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota  = Form.fields("AUX_ROTA").value();
			auxGrupo = Form.fields("DESTINO").value();

			if(auxRota == "Finalizar Atendimento" || auxRota == "Encaminhar Chamado"){
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();
			}
			if(auxRota == "Devolver ao Solicitante"){
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

	var modelo     = Form.fields("AUX_MODELO").value();
	var grupo_user = Form.fields("AUX_GRUPO_USER").value();
	var auxDestino = "";

	auxGrupo = "";
	auxCat   = "";
	auxSub   = "";

	if(codigoEtapa == DEFINIR_CATEGORIA)   {

		// Chamado aberto UAD > PA
		if(modelo == grupo_user){ 
		
			gruposPA();
			ORIGEM_UAD = "S";

		} 

		// Chamado aberto PA > UAD
		else{

			listaDestinos(modelo);
			ORIGEM_UAD = "N";
			Form.fields("AUX_APROV_LIDER").value("Não").apply();

		}

		// Carregar categorias do modelo aberto
		if(modelo == "99 - Administrativo")    { categoriasAdministrativo(); } else
		if(modelo == "99 - Agência Virtual")   { categoriasAgenciaVirtual(); } else
		if(modelo == "99 - Adquirencia")       { categoriasAdquirencia   (); } else
		if(modelo == "99_cons_consig")         { categoriasConsorcio     (); } else
		if(modelo == "99_cadastro")            { categoriasCadastro      (); } else
		if(modelo == "99 - Câmbio")            { categoriasCambio        (); } else
		if(modelo == "99 - Cartões")           { categoriasCartoes       (); } else
		if(modelo == "99 - Cobrança Adm")      { categoriasCobrancaAdm   (); } else
		if(modelo == "99 - Cobrança Bancária") { categoriasCobranca      (); } else
		if(modelo == "99 - Compensação")       { categoriasCompensacao   (); } else
		if(modelo == "99 - Conectividade")     { categoriasConectividade (); } else
		if(modelo == "99 - Contabilidade")     { categoriasContabilidade (); } else
		if(modelo == "99 - Contas a Pagar")    { categoriasContasPagar   (); } else
		if(modelo == "99 - Correspondente")    { categoriasCorrespondente(); } else
		if(modelo == "99 - Crédito Comercial") { categoriasCredito       (); } else
		if(modelo == "99 - Crédito Rural")     { categoriasRural         (); } else
		if(modelo == "99 - Governança")        { categoriasGovernanca    (); } else
		if(modelo == "99 - Marketing")         { categoriasMarketing     (); } else
		if(modelo == "99 - Processos")         { categoriasProcessos     (); } else
		if(modelo == "99 - PLD")               { categoriasPLD           (); } else
		if(modelo == "99 - RH")                { categoriasRH            (); } else
		if(modelo == "99 - Seguros")           { categoriasSeguro        (); } else
		if(modelo == "99 - Tecnologia")        { categoriasTecnologia    (); } else
		if(modelo == "99 - Tesouraria")        { categoriasTesouraria    (); } 
			
	}	

	if(codigoEtapa == COMPLEMENTAR_CHAMADO){ 
		
		auxGrupo = Form.fields("AUX_GRUPO").value();
		auxDestino = Form.fields("DESTINO").value();

		console.log("grupo set form: " + auxGrupo);
		console.log("destino set form: " + auxDestino);

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao : " + posicao);
		console.log("teste : " + teste);

		if(posicao == 0){ gruposUAD(); }
		
		if(posicao == -1){ gruposPA(); }

	}		

	if(codigoEtapa == REDIRECIONAR_CHAMADO){

		// Carregar grupos para transferência de chamado
		Form.fields("DESTINO").removeOptions([]);
		Form.fields("CATEGORIA").removeOptions([]);	
		Form.fields("SUBCATEGORIA").removeOptions([]);	
		gruposUAD();

	}

	if(codigoEtapa == REALIZAR_ATENDIMENTO){

		Form.fields("AUX_ROTA").value("").apply();		
		
		auxGrupo = Form.fields("AUX_GRUPO").value();
		auxCat   = Form.fields("CATEGORIA").value();
		auxSub   = Form.fields("SUBCATEGORIA").value();

		if(auxGrupo.toString().substring(0,2) == "99"){
			gruposUAD();
			listaRotas();
		}
		if(auxGrupo.toString().substring(0,2) != "99"){
			listaDestinos(modelo);
			listaRotasPA();
		}	

		listaCategorias(auxGrupo);
		listaSubcategorias(auxGrupo, auxCat);

		Form.actions('aprovar').disabled(true).apply();
		Form.actions('rejeitar').disabled(true).apply();

	}	

	if(codigoEtapa == APROVACAO_ALCADA_2)  { 

		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();
		Form.fields("AUX_ROTA").value("").apply();

		auxGrupo = Form.fields("AUX_GRUPO").value();
		auxCat   = Form.fields("CATEGORIA").value();
		auxSub   = Form.fields("SUBCATEGORIA").value();		

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){ gruposUAD(); }
		
		if(posicao == -1){ gruposPA(); }		

		listaCategorias(auxGrupo);
		listaSubcategorias(auxGrupo, auxCat);		

		listaRotas(); 
		Form.actions('aprovar').disabled(true).apply();
		Form.actions('rejeitar').disabled(true).apply();

	}

	if(codigoEtapa == AGUARDANDO_TERCEIROS){ 

		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();
		Form.fields("AUX_ROTA").value("").apply();

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){ gruposUAD(); }
		
		if(posicao == -1){ gruposPA(); }		
		
		listaRotas(); 

		Form.actions('aprovar').disabled(true).apply();
		Form.actions('rejeitar').disabled(true).apply();

	}

	if(codigoEtapa == APROVACAO_ALCADA_3)  { 

		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();
		Form.fields("AUX_ROTA").value("").apply();

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){ gruposUAD(); }

		if(posicao == -1){ gruposPA(); }	

	}		

	if(codigoEtapa == ASSUMIR_NOVO)        { 
		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){ gruposUAD(); }

		if(posicao == -1){ gruposPA(); }
	 }

	if(codigoEtapa == ASSUMIR_INTERNO)     { 
		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){gruposUAD(); }
		
		if(posicao == -1){ gruposPA(); }
	}

	if(codigoEtapa == FINALIZAR_APROVADO)  { 
		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){ gruposUAD(); }
		if(posicao == -1){ gruposPA(); }
	}

	if(codigoEtapa == FINALIZAR_CANCELADO) { 
		auxDestino = Form.fields("DESTINO").value();
		Form.fields("AUX_GRUPO").value(auxDestino).apply();

		var teste = auxDestino.toString();
		var posicao = teste.indexOf("99");
		console.log("posicao: " + posicao);

		if(posicao == 0){ gruposUAD(); }
		
		if(posicao == -1){ gruposPA(); }
	}

	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators(){

	if(codigoEtapa == COMPLEMENTAR_CHAMADO){

		auxCat = Form.fields("CATEGORIA").value();
		auxSub = Form.fields("SUBCATEGORIA").value();		

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {

			debugger;

			// Validar grid anexos
			if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "G_ANEXOS", "quantidade": "0" })){
				reject();
				Form.apply();
			}

			debugger;

		});
		
		if(modelo == "99 - Cartões" && auxCat == "Limite Cartão" && auxSub == "Limite Acima de R$100.000,00"){
		
			Form.fields('DESCRICAO').setRequired('aprovar', true).apply();
		
		}

	}

}

function listaDestinos(modelo){

	var lista = Form.fields("DESTINO");

	if(modelo == "99 - Administrativo"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_administrativo");

		lista.addOptions([
			{ name: '99 - Administrativo',       value: '99_administrativo' },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Agência Virtual"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_agenciavirtual");

		lista.addOptions([
			{ name: '99 - Agência Virtual',      value: '99_agenciavirtual' },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Adquirencia"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_adquirencia");

		lista.addOptions([
			{ name: '99 - Adquirencia',          value: '99_adquirencia'    },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99_cadastro"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_cadastro");

		lista.addOptions([
			{ name: '99 - Cadastro',             value: '99_cadastro'       },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Câmbio"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_cambio");

		lista.addOptions([
			{ name: '99 - Câmbio',               value: '99_cambio'         },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Cartões"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_cartoes");

		lista.addOptions([
			{ name: '99 - Cartões',              value: '99_cartoes'        },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Cobrança Adm"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_cob_adm");

		lista.addOptions([
			{ name: '99 - Cobrança Adm',         value: '99_cob_adm'        },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Cobrança Bancária"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_cobranca");

		lista.addOptions([
			{ name: '99 - Cobrança Bancária',    value: '99_cobranca'       },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Compensação"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_compensascao");

		lista.addOptions([
			{ name: '99 - Compensação',          value: '99_compensascao'   },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99_cons_consig"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_cons_consig");

		lista.addOptions([
			{ name: '99 - Cadastro',                       value: '99_cadastro'       },
			{ name: '99 - Consórcio / Consignado / Previ', value: '99_cons_consig'    },
			{ name: '01 - Papanduva',                      value: '01_papanduva'      },
			{ name: '02 - Mafra',                		   value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      		   value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          		   value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        		   value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',        		   value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 		   value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         		   value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       		   value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        		   value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',            		   value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            		   value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           		   value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú',		   value: '14_sao_joao'       },
			{ name: '15 - Gravatá',             		   value: '15_gravata'        },
			{ name: '16 - São Borja',           	       value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Conectividade"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_conectividade");

		lista.addOptions([
			{ name: '99 - Conectividade',        value: '99_conectividade'  },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Contabilidade"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_contabilidade");

		lista.addOptions([
			{ name: '99 - Contabilidade',        value: '99_contabilidade'  },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Contas a Pagar"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_contas_pagar");

		lista.addOptions([
			{ name: '99 - Contas a Pagar',       value: '99_contas_pagar'   },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Correspondente"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_correspondente");

		lista.addOptions([
			{ name: '99 - Correspondente',       value: '99_correspondente' },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Crédito Comercial"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_credito");

		lista.addOptions([
			{ name: '99 - Crédito Comercial',    value: '99_credito'        },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Crédito Rural"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_rural");

		lista.addOptions([
			{ name: '99 - Crédito Rural',        value: '99_rural'          },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Crédito Rural"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_rural");

		lista.addOptions([
			{ name: '99 - Crédito Rural',        value: '99_rural'          },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 		
	else
	if(modelo == "99 - Governança"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_governanca");

		lista.addOptions([
			{ name: '99 - Governança',           value: '99_governanca'     },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Marketing"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_marketing");

		lista.addOptions([
			{ name: '99 - Marketing',            value: '99_marketing'      },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Processos"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_processos");

		lista.addOptions([
			{ name: '99 - Processos',            value: '99_processos'      },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - PLD"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_pld");

		lista.addOptions([
			{ name: '99 - PLD',                  value: '99_pld'            },	
			{ name: '01 - Papanduva',            value: '01_papanduva'      },
			{ name: '02 - Mafra',                value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                 value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',             value: '11_craveiro'       },
			{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
			{ name: '13 - Navegantes',           value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
			{ name: '15 - Gravatá',              value: '15_gravata'        },
			{ name: '16 - São Borja',            value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - RH"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_rh");

		lista.addOptions([
			{ name: '99 - RH / Gestão de Pessoas', value: '99_rh'             },	
			{ name: '01 - Papanduva',              value: '01_papanduva'      },
			{ name: '02 - Mafra',                  value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',        value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',            value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',          value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',           value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                   value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',           value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',         value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',          value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',               value: '11_craveiro'       },
			{ name: '12 - Witmarsum',              value: '12_witmarsum'      },
			{ name: '13 - Navegantes',             value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú',   value: '14_sao_joao'       },
			{ name: '15 - Gravatá',                value: '15_gravata'        },
			{ name: '16 - São Borja',              value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Seguros"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_seguros");

		lista.addOptions([
			{ name: '99 - Seguros',                value: '99_seguros'        },	
			{ name: '01 - Papanduva',              value: '01_papanduva'      },
			{ name: '02 - Mafra',                  value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',        value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',            value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',          value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',           value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                   value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',           value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',         value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',          value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',               value: '11_craveiro'       },
			{ name: '12 - Witmarsum',              value: '12_witmarsum'      },
			{ name: '13 - Navegantes',             value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú',   value: '14_sao_joao'       },
			{ name: '15 - Gravatá',                value: '15_gravata'        },
			{ name: '16 - São Borja',              value: '16_sao_borja'      },			
		]).apply();	

	} 	
	else
	if(modelo == "99 - Tecnologia"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_tecnologia");

		lista.addOptions([
			{ name: '99 - Tecnologia',             value: '99_tecnologia'     },	
			{ name: '01 - Papanduva',              value: '01_papanduva'      },
			{ name: '02 - Mafra',                  value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',        value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',            value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',          value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',           value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                   value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',           value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',         value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',          value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',               value: '11_craveiro'       },
			{ name: '12 - Witmarsum',              value: '12_witmarsum'      },
			{ name: '13 - Navegantes',             value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú',   value: '14_sao_joao'       },
			{ name: '15 - Gravatá',                value: '15_gravata'        },
			{ name: '16 - São Borja',              value: '16_sao_borja'      },			
		]).apply();	

	} 
	else
	if(modelo == "99 - Tesouraria"){

		if(codigoEtapa == DEFINIR_CATEGORIA) Form.fields("DESTINO").value("99_tesouraria");

		lista.addOptions([
			{ name: '99 - Tesouraria',             value: '99_tesouraria'     },	
			{ name: '01 - Papanduva',              value: '01_papanduva'      },
			{ name: '02 - Mafra',                  value: '02_mafra'          },
			{ name: '03 - Santa Terezinha',        value: '03_santa_terezinha'},
			{ name: '04 - Rio da Anta',            value: '04_rio_anta'       },
			{ name: '05 - Santa Cecília',          value: '05_santa_cecilia'  },
			{ name: '06 - Major Vieira',           value: '06_major_vieira'   },
			{ name: '07 - Ijuí',                   value: '07_ijui'           },
			{ name: '08 - Santo Ângelo',           value: '08_santo_angelo'   },
			{ name: '09 - Vitor Meireles',         value: '09_vitor_meireles' },
			{ name: '10 - Monte Castelo',          value: '10_monte_castelo'  },
			{ name: '11 - Craveiro',               value: '11_craveiro'       },
			{ name: '12 - Witmarsum',              value: '12_witmarsum'      },
			{ name: '13 - Navegantes',             value: '13_navegantes'     },
			{ name: '14 - São João do Itaperiú',   value: '14_sao_joao'       },
			{ name: '15 - Gravatá',                value: '15_gravata'        },
			{ name: '16 - São Borja',              value: '16_sao_borja'      },			
		]).apply();	

	} 					

}

function listaRotas(){

	var lista = Form.fields("AUX_ROTA");

	if(codigoEtapa == REALIZAR_ATENDIMENTO){

		lista.addOptions([
			{ name: 'Finalizar Atendimento',    value: 'Finalizar Atendimento'   },
			{ name: 'Encaminhar Chamado',       value: 'Encaminhar Chamado'      },
			{ name: 'Submeter Alçada Nível 2',  value: 'Submeter Alçada Nível 2' },
			{ name: 'Aguardando Terceiros',     value: 'Aguardando Terceiros'    },
			{ name: 'Devolver ao Solicitante',  value: 'Devolver ao Solicitante' },
		]).apply();

	}

	if(codigoEtapa == APROVACAO_ALCADA_2){

		lista.addOptions([
			{ name: 'Aprovar Solicitação',     value: 'Aprovar Solicitação'     },
			{ name: 'Rejeitar Solicitação',    value: 'Rejeitar Solicitação'    },
			{ name: 'Submeter Alçada Nível 3', value: 'Submeter Alçada Nível 3' },
		]).apply();

	}	

	if(codigoEtapa == AGUARDANDO_TERCEIROS){

		lista.addOptions([
			{ name: 'Finalizar Atendimento',   value: 'Finalizar Atendimento'   },
			{ name: 'Encaminhar Chamado',      value: 'Encaminhar Chamado'      },
			{ name: 'Devolver ao Solicitante', value: 'Devolver ao Solicitante' },
		]).apply();

	}	

}

function listaRotasPA(){

	var lista = Form.fields("AUX_ROTA");

	lista.addOptions([
		{ name: 'Finalizar Atendimento',   value: 'Finalizar Atendimento'   },
		{ name: 'Encaminhar Chamado',      value: 'Encaminhar Chamado'      },
		{ name: 'Devolver ao Solicitante', value: 'Devolver ao Solicitante' },
	]).apply();	

}

function gruposUAD(){

	var lista = Form.fields("DESTINO");

	lista.addOptions([
		{ name: '99 - Administrativo',                 value: '99_administrativo' },
		{ name: '99 - Agência Virtual',                value: '99_agenciavirtual' },
		{ name: '99 - Adquirencia',                    value: '99_adquirencia'    },
		{ name: '99 - Cadastro',                       value: '99_cadastro'       },
		{ name: '99 - Câmbio',                         value: '99_cambio'         },
		{ name: '99 - Cartões',                        value: '99_cartoes'        },
		{ name: '99 - Cobrança Adm',                   value: '99_cob_adm'        },
		{ name: '99 - Cobrança Bancária',              value: '99_cobranca'       },
		{ name: '99 - Compensação',                    value: '99_compensascao'   },
		{ name: '99 - Consórcio / Consignado / Previ', value: '99_cons_consig'    },
		{ name: '99 - Conectividade',                  value: '99_conectividade'  },
		{ name: '99 - Contabilidade',                  value: '99_contabilidade'  },
		{ name: '99 - Contas a Pagar',                 value: '99_contas_pagar'   },
		{ name: '99 - Correspondente',                 value: '99_correspondente' },
		{ name: '99 - Crédito Comercial',              value: '99_credito'        },
		{ name: '99 - Crédito Rural',                  value: '99_rural'          },
		{ name: '99 - Governança',                     value: '99_governanca'     },
		{ name: '99 - Marketing',                      value: '99_marketing'      },
		{ name: '99 - Processos',                      value: '99_processos'      },
		{ name: '99 - PLD',                            value: '99_pld'            },
		{ name: '99 - RH / Gestão de Pessoas',         value: '99_rh'             },
		{ name: '99 - Seguros',                        value: '99_seguros'        },
		{ name: '99 - Tecnologia',                     value: '99_tecnologia'     },
		{ name: '99 - Tesouraria',                     value: '99_tesouraria'     },	
		{ name: '01 - Papanduva',                      value: '01_papanduva'      },
		{ name: '02 - Mafra',                		   value: '02_mafra'          },
		{ name: '03 - Santa Terezinha',      		   value: '03_santa_terezinha'},
		{ name: '04 - Rio da Anta',          		   value: '04_rio_anta'       },
		{ name: '05 - Santa Cecília',        		   value: '05_santa_cecilia'  },
		{ name: '06 - Major Vieira',         		   value: '06_major_vieira'   },
		{ name: '07 - Ijuí',                 		   value: '07_ijui'           },
		{ name: '08 - Santo Ângelo',         		   value: '08_santo_angelo'   },
		{ name: '09 - Vitor Meireles',       		   value: '09_vitor_meireles' },
		{ name: '10 - Monte Castelo',        		   value: '10_monte_castelo'  },
		{ name: '11 - Craveiro',             		   value: '11_craveiro'       },
		{ name: '12 - Witmarsum',            		   value: '12_witmarsum'      },
		{ name: '13 - Navegantes',           		   value: '13_navegantes'     },
		{ name: '14 - São João do Itaperiú', 		   value: '14_sao_joao'       },
		{ name: '15 - Gravatá',              		   value: '15_gravata'        },
		{ name: '16 - São Borja',            		   value: '16_sao_borja'      },		
	]).apply();	

}

function gruposPA(){

	var lista = Form.fields("DESTINO");

	lista.addOptions([
		{ name: '01 - Papanduva',            value: '01_papanduva'      },
		{ name: '02 - Mafra',                value: '02_mafra'          },
		{ name: '03 - Santa Terezinha',      value: '03_santa_terezinha'},
		{ name: '04 - Rio da Anta',          value: '04_rio_anta'       },
		{ name: '05 - Santa Cecília',        value: '05_santa_cecilia'  },
		{ name: '06 - Major Vieira',         value: '06_major_vieira'   },
		{ name: '07 - Ijuí',                 value: '07_ijui'           },
		{ name: '08 - Santo Ângelo',         value: '08_santo_angelo'   },
		{ name: '09 - Vitor Meireles',       value: '09_vitor_meireles' },
		{ name: '10 - Monte Castelo',        value: '10_monte_castelo'  },
		{ name: '11 - Craveiro',             value: '11_craveiro'       },
		{ name: '12 - Witmarsum',            value: '12_witmarsum'      },
		{ name: '13 - Navegantes',           value: '13_navegantes'     },
		{ name: '14 - São João do Itaperiú', value: '14_sao_joao'       },
		{ name: '15 - Gravatá',              value: '15_gravata'        },
		{ name: '16 - São Borja',            value: '16_sao_borja'      },
	]).apply();

}

function listaCategorias(grupo){

	if(grupo == "99_administrativo") { categoriasAdministrativo(); } else
	if(grupo == "99_agenciavirtual") { categoriasAgenciaVirtual(); } else
	if(grupo == "99_adquirencia")    { categoriasAdquirencia   (); } else
	if(grupo == "99_cons_consig")    { categoriasConsorcio     (); } else
	if(grupo == "99_cadastro")       { categoriasCadastro      (); } else
	if(grupo == "99_cambio")         { categoriasCambio        (); } else
	if(grupo == "99_cartoes")        { categoriasCartoes       (); } else
	if(grupo == "99_cob_adm")        { categoriasCobrancaAdm   (); } else
	if(grupo == "99_cobranca") 		 { categoriasCobranca      (); } else
	if(grupo == "99_compensascao")   { categoriasCompensacao   (); } else
	if(grupo == "99_conectividade")  { categoriasConectividade (); } else
	if(grupo == "99_contabilidade")  { categoriasContabilidade (); } else
	if(grupo == "99_contas_pagar")   { categoriasContasPagar   (); } else
	if(grupo == "99_correspondente") { categoriasCorrespondente(); } else
	if(grupo == "99_credito") 		 { categoriasCredito       (); } else
	if(grupo == "99_rural")          { categoriasRural         (); } else
	if(grupo == "99_governanca")     { categoriasGovernanca    (); } else
	if(grupo == "99_marketing")      { categoriasMarketing     (); } else
	if(grupo == "99_processos")      { categoriasProcessos     (); } else
	if(grupo == "99_pld")            { categoriasPLD           (); } else
	if(grupo == "99_rh")             { categoriasRH            (); } else
	if(grupo == "99_seguros")        { categoriasSeguro        (); } else
	if(grupo == "99_tecnologia")     { categoriasTecnologia    (); } else
	if(grupo == "99_tesouraria")     { categoriasTesouraria    (); } 

}

function listaSubcategorias(grupo, categoria){

	if(grupo == "99_adquirencia")    { subcategoriasAdquirencia    (categoria); } else
	if(grupo == "99_agenciavirtual") { subcategoriasAgenciaVirtual (categoria); } else
	if(grupo == "99_cons_consig")    { subcategoriasConsorcio      (categoria); } else
	if(grupo == "99_cadastro")       { subcategoriasCadastro       (categoria); } else
	if(grupo == "99_cartoes")        { subcategoriasCartoes        (categoria); } else
	if(grupo == "99_cobranca")       { subcategoriasCobranca       (categoria); } else
	if(grupo == "99_compensascao")   { subcategoriasCompensacao    (categoria); } else
	if(grupo == "99_credito")        { subcategoriasCredito        (categoria); } else
	if(grupo == "99_rural")          { subcategoriasRural          (categoria); } else
	if(grupo == "99_rh")             { subcategoriasRH             (categoria); } else
	if(grupo == "99_seguros")        { subcategoriasSeguro         (categoria); } else
	if(grupo == "99_administrativo") { subcategoriasAdministrativo (categoria); } else
	if(grupo == "99_cambio")         { subcategoriasCambio         (categoria); } else
	if(grupo == "99_cob_adm")        { subcategoriasCobrancaAdm    (categoria); } else
	if(grupo == "99_conectividade")  { subcategoriasConectividade  (categoria); } else
	if(grupo == "99_contabilidade")  { subcategoriasContabilidade  (categoria); } else
	if(grupo == "99_contas_pagar")   { subcategoriasContasPagar    (categoria); } else
	if(grupo == "99_correspondente") { subcategoriasCorrespondente (categoria); } else
	if(grupo == "99_governanca")     { subcategoriasGovernanca     (categoria); } else
	if(grupo == "99_marketing")      { subcategoriasMarketing      (categoria); } else
	if(grupo == "99_processos")      { subcategoriasProcessos      (categoria); } else
	if(grupo == "99_pld")            { subcategoriasPLD            (categoria); } else
	if(grupo == "99_tecnologia")     { subcategoriasTecnologia     (categoria); } else
	if(grupo == "99_tesouraria")     { subcategoriasTesouraria     (categoria); } 

}

function categoriaAprovaGerente(modelo, categoria, subcategoria){

	if(modelo == "99 - Seguros"){

		if(categoria == "Sinistros" && subcategoria == "Recusas")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	} 
	else
	if(modelo == "99 - Cartões"){

		if( (categoria == "Estorno / Isenção"  && subcategoria == "Anuidade"                    ) ||
		    (categoria == "Estorno / Isenção"  && subcategoria == "Pagamento em Duplicidade"    ) ||
			(categoria == "Outros"             && subcategoria == "Outros"                      ) ||
			(categoria == "Cartão Puro Débito" && subcategoria == "Solicitação"                 ) ||
			(categoria == "Limite Cartão"      && subcategoria == "Cancelamento de Limite"      ) ||
			(categoria == "Limite Cartão"      && subcategoria == "Limite Acima de R$100.000,00") )
			
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99 - Adquirencia"){

		if(categoria == "Reembolso Aluguel" && subcategoria == "Solicitações em Geral")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99 - Câmbio"){

		if(categoria == "Suporte ao Produto" && subcategoria == "Solicitação de Limite de Cãmbio")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99 - Correspondente"){

		if(categoria == "Suporte ao Produto" && subcategoria == "Abertura de Correspondente Bancário")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99 - Compensação"){

		if( (categoria == "Estornos" 			   && subcategoria == "Tarifas / Juros/ IOF / Outros") ||
			(categoria == "Prorrogação Fechamento" && subcategoria == "Fechamento Cooperativa"       ) )

			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99 - Conectividade"){

		if( (categoria == "Conectividade" && subcategoria == "TAG"                         ) ||
		    (categoria == "Conectividade" && subcategoria == "Telefonia Móvel"             ) ||
			(categoria == "Conectividade" && subcategoria == "Monitoramento e Rastreamento") )

			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	if(modelo == "99 - Tecnologia"){

		if(categoria == "Permissões de Acesso" && subcategoria == "Sisbr")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99 - RH"){

		if( (categoria == "Admissão" 		   && subcategoria == "Aprovação / Abertura de Vaga") ||
			(categoria == "Admissão" 		   && subcategoria == "Acessos"                     ) ||
			(categoria == "Admissão" 		   && subcategoria == "Equipamentos"                ) ||       
			(categoria == "Recisão" 		   && subcategoria == "Solicitação de Aviso"        ) ||
			(categoria == "Recisão" 		   && subcategoria == "Bloqueio de Acessos"         ) ||
			(categoria == "Folha de Pagamento" && subcategoria == "Informações para Folha"      ) ||
			(categoria == "Folha de Pagamento" && subcategoria == "Quebra de Caixa"             ) ||
			(categoria == "Folha de Pagamento" && subcategoria == "Auxílio Babá"                ) ||
			(categoria == "Folha de Pagamento" && subcategoria == "Consignado"                  ) ||
			(categoria == "Folha de Pagamento" && subcategoria == "Reajuste"                    ) ||
			(categoria == "Férias" 			   && subcategoria == "Solicitação de Férias"       ) ||
			(categoria == "Ronda (Ponto)" 	   && subcategoria == "Alteração de Escala"         ) ||
			(categoria == "RPA" 			   && subcategoria == "Solicitação"                 ) ||
			(categoria == "Uniforme" 		   && subcategoria == "Solicitação"                 ) ||
			(categoria == "Exame" 			   && subcategoria == "Mudança de Função"           ) )

			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99 - Agência Virtual"){

		if(categoria == "Agência Virtual" && subcategoria == "Transferência de Carteira")

		  { Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99 - Marketing"){

		if(categoria == "Comunicação e Marketing" && subcategoria == "Publicação Site/Redes Sociais")

		  { Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}							

}

function categoriasTecnologia(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Suporte Sistemas Internos',     value: 'Suporte Sistemas Internos'    },
		{ name: 'Suporte Canais de Atendimento', value: 'Suporte Canais de Atendimento'},
		{ name: 'Equipamentos',                  value: 'Equipamentos'                 },
		{ name: 'Permissões de Acesso',          value: 'Permissões de Acesso'         },
		{ name: 'Prorrogação de Desligamento',   value: 'Prorrogação de Desligamento'  },
	]).apply();
}	

function subcategoriasTecnologia(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Suporte Sistemas Internos"){

		lista.addOptions([	
			{ name: 'Sisbr',              value: 'Sisbr'             },
			{ name: 'Caixa',              value: 'Caixa'             },
			{ name: 'Sistema de Senhas',  value: 'Sistema de Senhas' },
			{ name: 'MK Sense',           value: 'MK Sense'          },
			{ name: 'Aplicativos Office', value: 'Aplicativos Office'},
		]).apply();

	}
	else
	if(categoria == "Suporte Canais de Atendimento"){

		lista.addOptions([	
			{ name: 'Sicoobnet - Instalação',  value: 'Sicoobnet - Instalação' },
			{ name: 'Sicoobnet Celular',       value: 'Sicoobnet Celular'      },
			{ name: 'Correspondente Bancário', value: 'Correspondente Bancário'},
			{ name: 'Folha de Pagamento',      value: 'Folha de Pagamento'     },
			{ name: 'Custódia de Cheques',     value: 'Custódia de Cheques'    },
			{ name: 'PIX',                     value: 'PIX'                    },
			{ name: 'Sicoob Pay',              value: 'Sicoob Pay'             },
			{ name: 'ATMs - Funções',          value: 'ATMs - Funções'         },
		]).apply();

	}
	else
	if(categoria == "Equipamentos"){

		lista.addOptions([	
			{ name: 'ATMs - Infra',          value: 'ATMs - Infra'         },
			{ name: 'Computadores',          value: 'Computadores'         },
			{ name: 'Impressoras',           value: 'Impressoras'          },
			{ name: 'Equipamentos de Caixa', value: 'Equipamentos de Caixa'},
			{ name: 'Outros',                value: 'Outros'               },
		]).apply();

	}
	else
	if(categoria == "Permissões de Acesso"){

		lista.addOptions([	
			{ name: 'Sisbr',               value: 'Sisbr'              },// Gerente aprova
			{ name: 'Lecom',               value: 'Lecom'              },
			{ name: 'Sipagnet',            value: 'Sipagnet'           },
			{ name: 'Servidor (F)/Pastas', value: 'Servidor (F)/Pastas'},
			{ name: 'Sites',               value: 'Sites'              },
			{ name: 'Novo Colaborador',    value: 'Novo Colaborador'   },
			{ name: 'Outros',              value: 'Outros'             },
		]).apply();

	}	
	else
	if(categoria == "Prorrogação de Desligamento"){

		lista.addOptions([	
			{ name: 'Prorrogar Desligamento de Computadores', value: 'Prorrogar Desligamento de Computadores'},
		]).apply();

	}	

}

function categoriasCobranca(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Suporte ao Produto',                 value: 'Suporte ao Produto'                },
		{ name: 'Habilitação de Serviços',            value: 'Habilitação de Serviços'           },
		{ name: 'Homologação - Abertura de Processo', value: 'Homologação - Abertura de Processo'},
	]).apply();
}

function subcategoriasCobranca(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Suporte ao Produto"){

		lista.addOptions([	
			{ name: 'Boletos',              value: 'Boletos'             },
			{ name: 'Protesto/Negativação', value: 'Protesto/Negativação'},
			{ name: 'Arquivo de Remessa',   value: 'Arquivo de Remessa'  },
			{ name: 'Relatórios',           value: 'Relatórios'          },
		]).apply();

	}
	else
	if(categoria == "Habilitação de Serviços"){

		lista.addOptions([	
			{ name: 'Cadastro de Cedente',             value: 'Cadastro de Cedente'            },
			{ name: 'Protesto/Negativação Automática', value: 'Protesto/Negativação Automática'},
			{ name: 'VAN',                             value: 'VAN'                            },
			{ name: 'Alteração de Perfil Tarifário',   value: 'Alteração de Perfil Tarifário'  },
		]).apply();

	}
	else
	if(categoria == "Homologação - Abertura de Processo"){

		lista.addOptions([	
			{ name: 'Emissão de Títulos',                                   value: 'Emissão de Títulos'                                  },
			{ name: 'Folha de Pagamento / Contas a Pagar / Transferências', value: 'Folha de Pagamento / Contas a Pagar / Transferências'},
		]).apply();

	}	

}

function categoriasConsorcio(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Consórcio',  value: 'Consórcio' },
		{ name: 'Consignado', value: 'Consignado'},
		{ name: 'Previ',      value: 'Previ'     },
	]).apply();

}

function subcategoriasConsorcio(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Consórcio"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral',                    value: 'Solicitações em Geral'                   },
			{ name: 'Formalização Venda/ Pendência / Cobrança', value: 'Formalização Venda/ Pendência / Cobrança'},
			{ name: 'Contemplação / Transf. Cotas',             value: 'Contemplação / Transf. Cotas'            },
		]).apply();

	}
	else
	if(categoria == "Consignado"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral',                                  value: 'Solicitações em Geral'                                 },
			{ name: 'Quitação Contrato / Parcelas / Extrato / Demonstrativo', value: 'Quitação Contrato / Parcelas / Extrato / Demonstrativo'},
			{ name: 'Relatório Prova de Vida',                                value: 'Relatório Prova de Vida'                               },
		]).apply();

	}
	else
	if(categoria == "Previ"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral',                                   value: 'Solicitações em Geral'                                  },
			{ name: 'Portabilidade / Proposta Incrição',                       value: 'Portabilidade / Proposta Incrição'                      },
			{ name: 'Aporte / Termo de Opção / Resgate / Pedido de Benefício', value: 'Aporte / Termo de Opção / Resgate / Pedido de Benefício'},
			{ name: 'Alterações/Atualizações de Contruibuição / Cobrança',     value: 'Alterações/Atualizações de Contruibuição / Cobrança'    },
		]).apply();

	}

}

function categoriasSeguro(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Prestamista',                  value: 'Prestamista'                 },
		{ name: 'Sinistros',                    value: 'Sinistros'                   },
		{ name: 'Renovação',                    value: 'Renovação'                   },
		{ name: 'Recusas',                      value: 'Recusas'                     },
		{ name: 'Parcelas Pendentes / Boletos', value: 'Parcelas Pendentes / Boletos'},
		{ name: 'Comissão',                     value: 'Comissão'                    },
		{ name: 'Cancelamento',                 value: 'Cancelamento'                },
		{ name: 'Desconto',                     value: 'Desconto'                    },
		{ name: 'Endosso',                      value: 'Endosso'                     },
		{ name: 'Cotações',                     value: 'Cotações'                    },
		{ name: 'Apoio Comercial',              value: 'Apoio Comercial'             },
		{ name: 'Dúvidas Comerciais',           value: 'Dúvidas Comerciais'          },
	]).apply();

}

function subcategoriasSeguro(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Sinistros"){

		lista.addOptions([	
			{ name: 'Abertura Vida e Prestamista Sicoob Seguradora', value: 'Abertura Vida e Prestamista Sicoob Seguradora'},
			{ name: 'Recusas',                                       value: 'Recusas'                                      },// Gerente aprova
		]).apply();

	}
	else
	if(categoria == "Prestamista"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Renovação"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Recusas"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Parcelas Pendentes / Boletos"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Comissão"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Cancelamento"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Desconto"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Endosso"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Cotações"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Apoio Comercial"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Dúvidas Comerciais"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}									

}

function categoriasRural(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Crédito Rural',       value: 'Crédito Rural'      },
		{ name: 'Financiamento BNDES', value: 'Financiamento BNDES'},
	]).apply();

}

function subcategoriasRural(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Crédito Rural"){

		lista.addOptions([	
			{ name: 'Análise Técnica',      value: 'Análise Técnica'     },
			{ name: 'CRL',                  value: 'CRL'                 },
			{ name: 'Dúvidas',              value: 'Dúvidas'             },
			{ name: 'Fiscalização',         value: 'Fiscalização'        },
			{ name: 'Liberação de Crédito', value: 'Liberação de Crédito'},
			{ name: 'Outros',               value: 'Outros'              },
		]).apply();

	}
	else
	if(categoria == "Financiamento BNDES"){

		lista.addOptions([	
			{ name: 'CRL',                   value: 'CRL'                  },
			{ name: 'Dúvidas',               value: 'Dúvidas'              },
			{ name: 'Pendências',            value: 'Pendências'           },
			{ name: 'Quitação',              value: 'Quitação'             },
			{ name: 'Renovações Cadastrais', value: 'Renovações Cadastrais'},
			{ name: 'Renovações Seguros',    value: 'Renovações Seguros'   },
			{ name: 'Outros',                value: 'Outros'               },
		]).apply();

	}

}

function categoriasCredito(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'CRL',                                       value: 'CRL'                                      },
		{ name: 'Assinatura Eletrônica',                     value: 'Assinatura Eletrônica'                    },
		{ name: 'Liberação de Crédito',                      value: 'Liberação de Crédito'                     },
		{ name: 'Operações de Crédito',                      value: 'Operações de Crédito'                     },
		{ name: 'Dúvidas',                                   value: 'Dúvidas'                                  },
		{ name: 'Fábrica de Limites',                        value: 'Fábrica de Limites'                       },
		{ name: 'Contrapartes Conectadas (Grupo Econômico)', value: 'Contrapartes Conectadas (Grupo Econômico)'},
		{ name: 'Documentos Pendentes',                      value: 'Documentos Pendentes'                     },
		{ name: 'Liberação Talão de Cheque',                 value: 'Liberação Talão de Cheque'                },
		{ name: 'Liquidação',                                value: 'Liquidação'                               },
	]).apply();

}

function subcategoriasCredito(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "CRL"){

		lista.addOptions([	
			{ name: 'Pessoa Física',           value: 'Pessoa Física'          },
			{ name: 'Pessoa Jurídica',         value: 'Pessoa Jurídica'        },
			{ name: 'Pessoa Jurídica (Maior)', value: 'Pessoa Jurídica (Maior)'},
			{ name: 'Produtos e Serviços',     value: 'Produtos e Serviços'    },// Cartões atende
		]).apply();

	}
	else
	if(categoria == "Liberação de Crédito"){

		lista.addOptions([	
			{ name: 'Cheque Especial / Conta Garantida', value: 'Cheque Especial / Conta Garantida'},
			{ name: 'Títulos Descontados',               value: 'Títulos Descontados'              },
			{ name: 'Financiamento',                     value: 'Financiamento'                    },
			{ name: 'Giro Parcelado / Crédito Pessoal',  value: 'Giro Parcelado / Crédito Pessoal' },
			{ name: 'Giro Rotativo',                     value: 'Giro Rotativo'                    },
			{ name: 'Consignado Privado',                value: 'Consignado Privado'               },
			{ name: 'Renegociação',                      value: 'Renegociação'                     },
			{ name: 'Cartões (Interno UAD)',             value: 'Cartões (Interno UAD)'            },
		]).apply();

	}
	else
	if(categoria == "Operações de Crédito"){

		lista.addOptions([	
			{ name: 'Prorrogação',           value: 'Prorrogação'           },
			{ name: 'Cancelamento',          value: 'Cancelamento'          },
			{ name: 'Seguro Prestamista',    value: 'Seguro Prestamista'    },
			{ name: 'Garantias Reais',       value: 'Garantias Reais'       },
			{ name: 'Estorno de Parcela',    value: 'Estorno de Parcela'    },
			{ name: 'Solicitação de Boleto', value: 'Solicitação de Boleto' },
		]).apply();

	}
	else
	if(categoria == "Dúvidas"){

		lista.addOptions([	
			{ name: 'Controles',             value: 'Controles'            },
			{ name: 'Análise de Crédito',    value: 'Análise de Crédito'   },
			{ name: 'Plataforma de Crédito', value: 'Plataforma de Crédito'},
		]).apply();

	}	
	else
	if(categoria == "Fábrica de Limites"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}		
	else
	if(categoria == "Contrapartes Conectadas (Grupo Econômico)"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Documentos Pendentes"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Liberação Talão de Cheque"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Assinatura Eletrônica"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Liquidação"){

		lista.addOptions([	
			{ name: 'Amortização', value: 'Amortização'},
			{ name: 'Quitação',    value: 'Quitação'   },
		]).apply();

	}				

}

function categoriasCobrancaAdm(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Óbito',   value: 'Óbito'  },
		{ name: 'Dúvidas', value: 'Dúvidas'},
	]).apply();

}

function subcategoriasCobrancaAdm(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Óbito"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Dúvidas"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}

}

function categoriasCartoes(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Suporte ao Produto',  value: 'Suporte ao Produto'  },
		{ name: 'Fraude',              value: 'Fraude'              },
		{ name: 'Desacordo Comercial', value: 'Desacordo Comercial' },
		{ name: 'Coopera',             value: 'Coopera'             },
		{ name: 'Cartões Salário',     value: 'Cartões Salário'     },
		{ name: 'Estorno / Isenção',   value: 'Estorno / Isenção'   },
		{ name: 'Limite Cartão',       value: 'Limite Cartão'       },
		{ name: 'Cartão Puro Débito',  value: 'Cartão Puro Débito'  },
		{ name: 'Cartão Provisório',   value: 'Cartão Provisório'   },
	]).apply();

}

function subcategoriasCartoes(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Suporte ao Produto"){

		lista.addOptions([	
			{ name: 'App Sicoobcard', value: 'App Sicoobcard' },
			{ name: 'Dúvidas',        value: 'Dúvidas'        },
		]).apply();

	}
	else
	if(categoria == "Fraude"){

		lista.addOptions([	
			{ name: 'Abertura do Processo de Contestação dos Valores', value: 'Abertura do Processo de Contestação dos Valores'},
		]).apply();

	}
	else
	if(categoria == "Desacordo Comercial"){

		lista.addOptions([	
			{ name: 'Abertura do Processo de Contestação dos Valores', value: 'Abertura do Processo de Contestação dos Valores'},
		]).apply();

	}	
	else
	if(categoria == "Coopera"){

		lista.addOptions([	
			{ name: 'Suporte ao Aplicativo', value: 'Suporte ao Aplicativo'},
			{ name: 'Suporte ao Site',       value: 'Suporte ao Site'      },
		]).apply();

	}
	else
	if(categoria == "Cartões Salário"){

		lista.addOptions([	
			{ name: 'Solicitação de Cartões Não Gerados Automaticamente', value: 'Solicitação de Cartões Não Gerados Automaticamente'},
			{ name: 'Cancelamento de Cartão',                             value: 'Cancelamento de Cartão'                            },
		]).apply();

	}	
	else
	if(categoria == "Estorno / Isenção"){

		lista.addOptions([	
			{ name: 'Anuidade',                 value: 'Anuidade'                },// Gerente Aprova
			{ name: 'Pagamento em Duplicidade', value: 'Pagamento em Duplicidade'},// Gerente Aprova
			{ name: 'Outros',                   value: 'Outros'                  },// Gerente Aprova
		]).apply();

	}	
	else
	if(categoria == "Limite Cartão"){

		lista.addOptions([	
			{ name: 'Solicitação',                  value: 'Solicitação'                 },
			{ name: 'Majoração',                    value: 'Majoração'                   },
			{ name: 'Cancelamento de Limite',       value: 'Cancelamento de Limite'      },
			{ name: 'Limite Acima de R$100.000,00', value: 'Limite Acima de R$100.000,00'},// Gerente Aprova
		]).apply();

	}	
	else
	if(categoria == "Cartão Puro Débito"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},
		]).apply();	
	
	}
	else
	if(categoria == "Cartão Provisório"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},
		]).apply();

	}	
}

function categoriasAdquirencia(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Suporte ao Produto',          value: 'Suporte ao Produto'         },
		{ name: 'Credenciamento',              value: 'Credenciamento'             },
		{ name: 'Negociação de Taxas',         value: 'Negociação de Taxas'        },
		{ name: 'Reembolso Aluguel',           value: 'Reembolso Aluguel'          },
		{ name: 'Relatórios',                  value: 'Relatórios'                 },
		{ name: 'Troca de Domicílio Bancário', value: 'Troca de Domicílio Bancário'},
	]).apply();

}

function subcategoriasAdquirencia(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Suporte ao Produto"){

		lista.addOptions([	
			{ name: 'Suporte Máquinas',                     value: 'Suporte Máquinas'                     },
			{ name: 'Reativação de Cadastro Suspenso',      value: 'Reativação de Cadastro Suspenso'      },
			{ name: 'Máquina Adicional',                    value: 'Máquina Adicional'                    },
			{ name: 'Recolhimento de Máquina',              value: 'Recolhimento de Máquina'              },
			{ name: 'Dúvidas Vendas / Antecipação / Taxas', value: 'RDúvidas Vendas / Antecipação / Taxas'},
			{ name: 'Aplicativo / Portal',                  value: 'Aplicativo / Portal'                  },
			{ name: 'Bobinas',                              value: 'Bobinas'                              },
		]).apply();

	}
	else
	if(categoria == "Credenciamento"){

		lista.addOptions([	
			{ name: 'POO / POS',               value: 'POO / POS'              },
			{ name: 'Sipaguinha',              value: 'Sipaguinha'             },
			{ name: 'TEF / E-commerce / Link', value: 'TEF / E-commerce / Link'},
		]).apply();

	}
	else
	if(categoria == "Negociação de Taxas"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Reembolso Aluguel"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},// Gerente aprova
		]).apply();

	}
	else
	if(categoria == "Relatórios"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Troca de Domicílio Bancário"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}				

}	

function categoriasCambio(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Suporte ao Produto', value: 'Suporte ao Produto'},
	]).apply();

}

function subcategoriasCambio(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Suporte ao Produto"){

		lista.addOptions([	
			{ name: 'Solicitação de Limite de Cãmbio', value: 'Solicitação de Limite de Cãmbio'},// Gerente aprova
			{ name: 'Dúvidas',                         value: 'Dúvidas'                        },
		]).apply();

	}

}

function categoriasCorrespondente(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Novo Correspondente', value: 'Novo Correspondente'},
	]).apply();

}

function subcategoriasCorrespondente(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Novo Correspondente"){

		lista.addOptions([	
			{ name: 'Abertura de Correspondente Bancário', value: 'Abertura de Correspondente Bancário'},// Gerente aprova
		]).apply();

	}

}

function categoriasCadastro(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Atualização Pessoa Física',   value: 'Atualização Pessoa Física'  },
		{ name: 'Atualização Pessoa Jurídica', value: 'Atualização Pessoa Jurídica'},
		{ name: 'Atualização Produtor Rural',  value: 'Atualização Produtor Rural' },
		{ name: 'Inclusão/Exclusão de Bens',   value: 'Inclusão/Exclusão de Bens'  },
		{ name: 'Conta Capital',               value: 'Conta Capital'              },
		{ name: 'Conta Corrente/Poupança',     value: 'Conta Corrente/Poupança'    },
		{ name: 'Conta Salário',               value: 'Conta Salário'              },
		{ name: 'Dúvidas',                     value: 'Dúvidas'                    },
	]).apply();

}

function subcategoriasCadastro(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Atualização Pessoa Física"){

		lista.addOptions([	
			{ name: 'Representante Legal/Procurador',       value: 'Representante Legal/Procurador'     },
			{ name: 'Consignado INSS',                      value: 'Consignado INSS'                    },
			{ name: 'Consignado Privado',                   value: 'Consignado Privado'                 },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',       value: 'Consórcio/Sipag/Cartões/Câmbio'     },
			{ name: 'Inclusão/Exclusão de Relacionamento',  value: 'Inclusão/Exclusão de Relacionamento'},
			{ name: 'Outros',                               value: 'Outros'                             },
		]).apply();

	}
	else
	if(categoria == "Atualização Pessoa Jurídica"){

		lista.addOptions([	
			{ name: 'Representante Legal/Procurador',       value: 'Representante Legal/Procurador'     },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',       value: 'Consórcio/Sipag/Cartões/Câmbio'     },
			{ name: 'Inclusão/Exclusão de Relacionamento',  value: 'Inclusão/Exclusão de Relacionamento'},
			{ name: 'Outros',                               value: 'Outros'                             },
		]).apply();

	}
	else	
	if(categoria == "Atualização Produtor Rural"){

		lista.addOptions([	
			{ name: 'Produtor Rural', value: 'Produtor Rural'},
			{ name: 'BNDES',          value: 'BNDES'         },
			{ name: 'Outros',         value: 'Outros'        },
		]).apply();

	}
	else	
	if(categoria == "Inclusão/Exclusão de Bens"){

		lista.addOptions([	
			{ name: 'Móvel',  value: 'Móvel' },
			{ name: 'Imóvel', value: 'Imóvel'},
		]).apply();

	}
	else
	if(categoria == "Conta Capital"){

		lista.addOptions([	
			{ name: 'Devolução Parcial / Resgate Cap.',  value: 'Devolução Parcial / Resgate Cap.'},
			{ name: 'Devolução Total',                   value: 'Devolução Total'                 },
			{ name: 'Pedido Demissão',                   value: 'Pedido Demissão'                 },
			{ name: 'Apontamento Bacen',                 value: 'Apontamento Bacen'               },
		]).apply();

	}	
	else
	if(categoria == "Conta Salário"){

		lista.addOptions([	
			{ name: 'Cadastro Fonte Pagadora',  value: 'Cadastro Fonte Pagadora'},
			{ name: 'Abertura',                 value: 'Abertura'               },
			{ name: 'Encerramento',             value: 'Encerramento'           },
			{ name: 'Portabilidade',            value: 'Portabilidade'          },
		]).apply();

	}
	else
	if(categoria == "Conta Corrente/Poupança"){

		lista.addOptions([	
			{ name: 'Encerramento C/C',              value: 'Encerramento C/C'              },
			{ name: 'Estorno Tarifas C/C',           value: 'Estorno Tarifas C/C'           },
			{ name: 'Saldo/Extrato C/P',             value: 'Saldo/Extrato C/P'             },
			{ name: 'Bloqueio de Conta/Falecimento', value: 'Bloqueio de Conta/Falecimento' },
			{ name: 'Dúvidas',                       value: 'Dúvidas'                       },
		]).apply();

	}	
	else
	if(categoria == "Dúvidas"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}			

}

function categoriasCompensacao(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Títulos / Convênios',    value: 'Títulos / Convênios'   },
		{ name: 'DOC / TED / PIX',        value: 'DOC / TED / PIX'       },
		{ name: 'Aplicação RDC',          value: 'Aplicação RDC'         },
		{ name: 'Aplicação LCI / LCA',    value: 'Aplicação LCI / LCA'   },
		{ name: 'Cheques',                value: 'Cheques'               },
		{ name: 'Débito Automático',      value: 'Débito Automático'     },
		{ name: 'DAD',                    value: 'DAD'                   },
		{ name: 'Cópias / Tarifas',       value: 'Cópias / Tarifas'      },
		{ name: 'Estornos',               value: 'Estornos'              },// Gerente aprova
		{ name: 'Prorrogação Fechamento', value: 'Prorrogação Fechamento'},// Gerente aprova
	]).apply();

}

function subcategoriasCompensacao(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Títulos / Convênios"){

		lista.addOptions([	
			{ name: 'Títulos em Aberto / Cópias / Outros', value: 'Títulos em Aberto / Cópias / Outros'},
		]).apply();

	}
	else
	if(categoria == "DOC / TED / PIX"){

		lista.addOptions([	
			{ name: 'Dúvidas', value: 'Dúvidas'},
		]).apply();

	}
	else
	if(categoria == "Aplicação RDC"){

		lista.addOptions([	
			{ name: 'Aplicação / Resgate', value: 'Aplicação / Resgate'},
		]).apply();

	}	
	else
	if(categoria == "Aplicação LCI / LCA"){

		lista.addOptions([	
			{ name: 'Aplicação / Resgate', value: 'Aplicação / Resgate'},
		]).apply();

	}	
	else
	if(categoria == "Cheques"){

		lista.addOptions([	
			{ name: 'Regularização / Baixa',                       value: 'Regularização / Baixa'                      },
			{ name: 'Devolução Cheques Sua Remessa (Depositados)', value: 'Devolução Cheques Sua Remessa (Depositados)'},
			{ name: 'Devolução Cheques Nossa Remessa',             value: 'Devolução Cheques Nossa Remessa'            },
			{ name: 'Dúvidas',                                     value: 'Dúvidas'                                    },
		]).apply();

	}
	else
	if(categoria == "Débito Automático"){

		lista.addOptions([	
			{ name: 'Estorno / Dúvidas', value: 'Estorno / Dúvidas'},
		]).apply();

	}	
	else
	if(categoria == "DAD"){

		lista.addOptions([	
			{ name: 'Solicitação / Regularização', value: 'Solicitação / Regularização'},
		]).apply();

	}	
	else
	if(categoria == "Cópias / Tarifas"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},
		]).apply();

	}
	else
	if(categoria == "Estornos"){

		lista.addOptions([	
			{ name: 'Tarifas / Juros/ IOF / Outros', value: 'Tarifas / Juros/ IOF / Outros'},// Gerente aprova
		]).apply();

	}	
	else
	if(categoria == "Prorrogação Fechamento"){

		lista.addOptions([	
			{ name: 'Fechamento Cooperativa', value: 'Fechamento Cooperativa'},// Gerente aprova
		]).apply();

	}					

}	

function categoriasPLD(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Análise de Ocorrências', value: 'Análise de Ocorrências'},
	]).apply();

}

function subcategoriasPLD(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Análise de Ocorrências"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},// Gerente aprova
		]).apply();

	}

}

function categoriasGovernanca(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Informações Para ATA', value: 'Informações Para ATA'},
	]).apply();

}

function subcategoriasGovernanca(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Informações Para ATA"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}

}

function categoriasTesouraria(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Suporte Caixa e Tesouraria', value: 'Suporte Caixa e Tesouraria'},
	]).apply();

}

function subcategoriasTesouraria(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Suporte Caixa e Tesouraria"){

		lista.addOptions([	
			{ name: 'Termos',         value: 'Termos'        },
			{ name: 'Justificativas', value: 'Justificativas'},
			{ name: 'Dúvidas',        value: 'Dúvidas'       },
		]).apply();

	}

}

function categoriasContabilidade(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Movimento de Caixa' , value: 'Movimento de Caixa'},
		{ name: 'Imobilizado',         value: 'Imobilizado'       },
		{ name: 'Dúvidas',             value: 'Dúvidas'           },
		{ name: 'Contratos',           value: 'Contratos'         },
		{ name: 'Alvará',              value: 'Alvará'            },
	]).apply();

}

function subcategoriasContabilidade(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Movimento de Caixa"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Imobilizado"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Dúvidas"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Contratos"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}	
	else
	if(categoria == "Alvará"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}				

}

function categoriasContasPagar(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Comprovante de Pagamento', value: 'Comprovante de Pagamento'},
		{ name: 'Pagamento a Fornecedores', value: 'Pagamento a Fornecedores'},
	]).apply();

}

function subcategoriasContasPagar(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Comprovante de Pagamento"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}
	else
	if(categoria == "Pagamento a Fornecedores"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}

}

function categoriasRH(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Admissão',                    value: 'Admissão'                   },
		{ name: 'Recisão',                     value: 'Recisão'                    },
		{ name: 'Folha de Pagamento',          value: 'Folha de Pagamento'         },
		{ name: 'Férias',                      value: 'Férias'                     },
		{ name: 'Plano de Saúde',              value: 'Plano de Saúde'             },
		{ name: 'Success',                     value: 'Success'                    },
		{ name: 'Recrutamento e Seleção',      value: 'Recrutamento e Seleção'     },
		{ name: 'Ronda (Ponto)',               value: 'Ronda (Ponto)'              },
		{ name: 'RPA',                         value: 'RPA'                        },
		{ name: 'Uniforme',                    value: 'Uniforme'                   },
		{ name: 'Vale Alimentação / Refeição', value: 'Vale Alimentação / Refeição'},
		{ name: 'Coopcerto',                   value: 'Coopcerto'                  },
		{ name: 'Exame',                       value: 'Exame'                      },
	]).apply();

}

function subcategoriasRH(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Admissão"){

		lista.addOptions([	
			{ name: 'Aprovação / Abertura de Vaga', value: 'Aprovação / Abertura de Vaga'},// Gerente aprova
			{ name: 'Acessos',                      value: 'Acessos'                     },// Gerente aprova
			{ name: 'Equipamentos',                 value: 'Equipamentos'                },// Gerente aprova
		]).apply();

	}
	else
	if(categoria == "Recisão"){

		lista.addOptions([	
			{ name: 'Solicitação de Aviso', value: 'Solicitação de Aviso'},// Gerente aprova
			{ name: 'Bloqueio de Acessos',  value: 'Bloqueio de Acessos' },// Gerente aprova
		]).apply();

	}
	else
	if(categoria == "Folha de Pagamento"){

		lista.addOptions([	
			{ name: 'Informações para Folha', value: 'Informações para Folha'},// Gerente aprova
			{ name: 'Reajuste',               value: 'Reajuste'              },// Gerente aprova
			{ name: 'Quebra de Caixa',        value: 'Quebra de Caixa'       },// Gerente aprova
			{ name: 'Auxílio Babá',           value: 'Auxílio Babá'          },// Gerente aprova
			{ name: 'Consignado',             value: 'Consignado'            },// Gerente aprova
		]).apply();

	}
	else
	if(categoria == "Férias"){

		lista.addOptions([	
			{ name: 'Solicitação de Férias', value: 'Solicitação de Férias'},// Gerente aprova
		]).apply();

	}	
	else
	if(categoria == "Plano de Saúde"){

		lista.addOptions([	
			{ name: 'Inclusão', value: 'Inclusão'},
			{ name: 'Exclusão', value: 'Exclusão'},
			{ name: 'Dúvidas',  value: 'Dúvidas' },
		]).apply();

	}	
	else
	if(categoria == "Success"){

		lista.addOptions([	
			{ name: 'Programa de Gestão e Desempenho (PGD)', value: 'Programa de Gestão e Desempenho (PGD)'},
			{ name: 'Sicoob Universidade',                   value: 'Sicoob Universidade'                  },
			{ name: 'Avaliação Experiência',                 value: 'Avaliação Experiência'                },
			{ name: 'Atribuições',                           value: 'Atribuições'                          },
			{ name: 'Certiificados',                         value: 'Certiificados'                        },
			{ name: 'Cursos',                                value: 'Cursos'                               },
		]).apply();

	}	
	else
	if(categoria == "Recrutamento e Seleção"){

		lista.addOptions([	
			{ name: 'Currículos', value: 'Currículos'},
		]).apply();

	}	
	else
	if(categoria == "Ronda (Ponto)"){

		lista.addOptions([	
			{ name: 'Alteração de Escala', value: 'Alteração de Escala'},// Gerente aprova
			{ name: 'Justificativa',       value: 'Justificativa'      },
			{ name: 'Atestado',            value: 'Atestado'           },
		]).apply();

	}	
	else
	if(categoria == "RPA"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},// Gerente aprova
		]).apply();

	}	
	else
	if(categoria == "Uniforme"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},// Gerente aprova
		]).apply();

	}	
	else
	if(categoria == "Vale Alimentação / Refeição"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},
			{ name: 'Dúvidas',     value: 'Dúvidas'    },
		]).apply();

	}
	else
	if(categoria == "Coopcerto"){

		lista.addOptions([	
			{ name: 'Solicitação', value: 'Solicitação'},
			{ name: 'Dúvidas',     value: 'Dúvidas'    },
		]).apply();

	}
	else
	if(categoria == "Exame"){

		lista.addOptions([	
			{ name: 'Mudança de Função', value: 'Mudança de Função'},// Gerente aprova
			{ name: 'Periódico',         value: 'Periódico'        },
		]).apply();

	}											

}	

function categoriasAdministrativo(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Solciitação de Material de Expediente', value: 'Solciitação de Material de Expediente'},
	]).apply();

}

function subcategoriasAdministrativo(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Solciitação de Material de Expediente"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}

}

function categoriasMarketing(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Comunicação e Marketing', value: 'Comunicação e Marketing'},
	]).apply();

}

function subcategoriasMarketing(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Comunicação e Marketing"){

		lista.addOptions([	
			{ name: 'Criação de Arte',               value: 'Criação de Arte'              },
			{ name: 'Publicação Site/Redes Sociais', value: 'Publicação Site/Redes Sociais'},
			{ name: 'Eventos',                       value: 'Eventos'                      },
			{ name: 'Outros',                        value: 'Outros'                       },
		]).apply();

	}

}

function categoriasProcessos(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Gestão de Demandas', value: 'Gestão de Demandas'},
	]).apply();

}

function subcategoriasProcessos(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Gestão de Demandas"){

		lista.addOptions([	
			{ name: 'Novo Processo',         value: 'Novo Processo'       },
			{ name: 'Sugestão de Melhoria',  value: 'Sugestão de Melhoria'},
			{ name: 'Dúvidas',               value: 'Dúvidas'             },
		]).apply();

	}

}

function categoriasConectividade(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Conectividade', value: 'Conectividade'},
	]).apply();

}

function subcategoriasConectividade(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Conectividade"){

		lista.addOptions([	
			{ name: 'TAG',                          value: 'TAG'                         },
			{ name: 'Telefonia Móvel',              value: 'Telefonia Móvel'             },
			{ name: 'Monitoramento e Rastreamento', value: 'Monitoramento e Rastreamento'},
		]).apply();

	}

}

function categoriasAgenciaVirtual(){

	var lista = Form.fields("CATEGORIA");

	lista.addOptions([
		{ name: 'Agência Virtual', value: 'Agência Virtual'},
	]).apply();

}

function subcategoriasAgenciaVirtual(categoria){

	var lista = Form.fields("SUBCATEGORIA");

	if(categoria == "Agência Virtual"){

		lista.addOptions([	
			{ name: 'Dúvidas',                   value: 'Dúvidas'                  },
			{ name: 'Transferência de Carteira', value: 'Transferência de Carteira'},
		]).apply();

	}

}