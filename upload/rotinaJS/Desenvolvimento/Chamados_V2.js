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
var REGISTRAR_CHAMADO    = 5;
var APROVAR_GERENTE      = 13
var ASSUMIR_NOVO         = 10;
var REALIZAR_ATENDIMENTO = 1;
var ASSUMIR_ANDAMENTO    = 11;
var AGUARDANDO_TERCEIROS = 4;
var APROVACAO_ALCADA_2   = 8;
var APROVACAO_ALCADA_3   = 9;
var AVALIAR_ATENDIMENTO  = 2;
var ARQUIVAR_CHAMADO     = 14;

// Variáveis auxiliares
var auxGrupo   = "";
var auxInicNom = "";
var auxInicLog = "";
var auxCat     = "";
var auxSub     = "";
var modelo     = "";
var grupoUser  = "";
var auxDestino = "";
var auxUniOrig = "";
var auxUnidade = "";
var auxSetor   = "";
var auxOrigem  = "";
var auxOriGrp  = "";
var auxOriUni  = "";
var listaDes   = "";
var listaCat   = "";
var listaSub   = "";
var listaSetor = "";
var lista      = "";
var proxResp   = "";
var gerenteAp  = "";
var nomeLider  = "";
var nomeUser   = "";
var nomeInic   = "";
var loginInic  = "";
var auxMembros = "";
var auxUserDev = "";
var auxDevolv  = "";
var auxAval    = "";
var auxData    = "";
var auxPriv    = "";
var auxAlc2    = "";
var auxAlc3    = "";
var auxCiclo   = 0;

function initLayout(){
	
	//	if( codigoEtapa == SOLICITAR ){
	//		Form.fields("SOLICITACAO1").className("col m12");
	//	}
	//	
	//	Form.apply();
}

function defineLabels(){
		
	//	Form.fields("VEIC_MODELO").label("Label a ser definido");
		
	//	Form.apply();
}

// EVENTOS DAS ATIVIDADES
function setEventos() {
	
	debugger;

	if(codigoEtapa == REGISTRAR_CHAMADO){	

		// Atualizar destino e unidade, limpar categoria e subcategoria
		Form.fields("DESTINO").subscribe("CHANGE", function(itemId, data, response) {

			auxDestino = Form.fields("DESTINO").value();
			auxOrigem  = Form.fields("ORIGEM").value();
			auxUnidade = auxDestino.toString().substring(0,2);
			auxUniOrig = auxOrigem.toString().substring(0,2);

			Form.fields("AUX_DESTINO").value(auxDestino).apply();

			Form.fields("CATEGORIA").removeOptions([]);
			Form.fields("SUBCATEGORIA").removeOptions([]);			

		});

		// Se for alterado o destino limpar os campos de setor
		Form.fields("AUX_DESTINO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			Form.fields("SETOR").value("").apply();

		});			

		// Atualizar setor e modelo, caso alterado limpar categoria e subcategoria
		Form.fields("SETOR").subscribe("CHANGE", function(itemId, data, response) {

			// Atualizar o modelo, o grupo de origem e o grupo de destino
			modelo    = Form.fields("SETOR").value();
			auxOriUni = auxOrigem.toString().substring(0,2);
			auxSetor  = modelo.toString().substring(2,30);
			auxGrupo  = auxUnidade + auxSetor;
			auxOriGrp = auxOriUni + auxSetor;

			console.log("auxOriGrp: " + auxOriGrp);

			Form.fields("AUX_GRUPO").value(auxGrupo).apply();
			Form.fields("AUX_MODELO").value(modelo).apply();
			Form.fields("AUX_ORIGEM").value(auxOriGrp).apply();

			Form.fields("CATEGORIA").removeOptions([]);
			Form.fields("SUBCATEGORIA").removeOptions([]);

			Form.fields("AUX_ROTA").value("").apply();			
			Form.fields("PROX_ETAPA").value("").apply();
			Form.fields("PROX_RESP").value("").apply();	
			Form.fields("CATEGORIA").value("").apply();	
			Form.fields("SUBCATEGORIA").value("").apply();			

			console.log("grupo: " + auxGrupo);
			console.log("modelo: " + modelo);
			console.log("uni orig: " + auxUniOrig);
			console.log("uni dest: " + auxUnidade);

			// Chamado aberto UAD para UAD
			if(auxUniOrig == "99" && auxUnidade == "99"){ 

				console.log("aberto UAD para UAD ");
				console.log("aux origem " + auxOrigem);

				if(auxOrigem == "99 - Administrativo")    { Form.fields("AUX_ORIGEM").value("99_administrativo").apply();  } 
				if(auxOrigem == "99 - Adquirencia")       { Form.fields("AUX_ORIGEM").value("99_adquirencia").apply();     } 
				if(auxOrigem == "99 - Agência Virtual")   { Form.fields("AUX_ORIGEM").value("99_agenciavirtual").apply();  } 
				if(auxOrigem == "99 - Arquivo")           { Form.fields("AUX_ORIGEM").value("99_arquivo").apply();         } 
				if(auxOrigem == "99 - Cadastro")          { Form.fields("AUX_ORIGEM").value("99_cadastro").apply();        } 
				if(auxOrigem == "99 - Caixa Itinerante")  { Form.fields("AUX_ORIGEM").value("99_caixa_itiner").apply();    } 
				if(auxOrigem == "99 - Câmbio")            { Form.fields("AUX_ORIGEM").value("99_cambio").apply(); 		  } 
				if(auxOrigem == "99 - Cartões")           { Form.fields("AUX_ORIGEM").value("99_cartoes").apply(); 		  } 
				if(auxOrigem == "99 - Cobrança Adm")      { Form.fields("AUX_ORIGEM").value("99_cob_adm").apply(); 		  } 
				if(auxOrigem == "99 - Cobrança Bancária") { Form.fields("AUX_ORIGEM").value("99_cobranca").apply();        } 
				if(auxOrigem == "99 - Compensação")       { Form.fields("AUX_ORIGEM").value("99_compensascao").apply();    } 
				if(auxOrigem == "99 - Conectividade")     { Form.fields("AUX_ORIGEM").value("99_conectividade").apply();   } 
				if(auxOrigem == "99 - Consorcio e Consig"){ Form.fields("AUX_ORIGEM").value("99_cons_consig").apply();     } 
				if(auxOrigem == "99 - Contabilidade")     { Form.fields("AUX_ORIGEM").value("99_contabilidade").apply();   } 
				if(auxOrigem == "99 - Contas a Pagar")    { Form.fields("AUX_ORIGEM").value("99_contas_pagar").apply();    } 
				if(auxOrigem == "99 - Controle Interno")  { Form.fields("AUX_ORIGEM").value("99_cont_interno").apply();    } 
				if(auxOrigem == "99 - Correspondente")    { Form.fields("AUX_ORIGEM").value("99_correspondente").apply();  } 
				if(auxOrigem == "99 - Crédito Comercial") { Form.fields("AUX_ORIGEM").value("99_credito").apply(); 		  } 
				if(auxOrigem == "99 - Crédito Rural")     { Form.fields("AUX_ORIGEM").value("99_rural").apply(); 		  } 
				if(auxOrigem == "99 - Direx")             { Form.fields("AUX_ORIGEM").value("99_direx").apply(); 		  } 
				if(auxOrigem == "99 - Governança")        { Form.fields("AUX_ORIGEM").value("99_governanca").apply();      } 
				if(auxOrigem == "99 - Marketing")         { Form.fields("AUX_ORIGEM").value("99_marketing").apply(); 	  } 
				if(auxOrigem == "99 - PLD")               { Form.fields("AUX_ORIGEM").value("99_pld").apply(); 			  } 
				if(auxOrigem == "99 - Processos")         { Form.fields("AUX_ORIGEM").value("99_processos").apply(); 	  } 
				if(auxOrigem == "99 - RH")                { Form.fields("AUX_ORIGEM").value("99_rh").apply(); 			  } 
				if(auxOrigem == "99 - Riscos")            { Form.fields("AUX_ORIGEM").value("99_riscos").apply(); 		  } 
				if(auxOrigem == "99 - Seguros")           { Form.fields("AUX_ORIGEM").value("99_seguros").apply(); 		  } 
				if(auxOrigem == "99 - Tecnologia")        { Form.fields("AUX_ORIGEM").value("99_tecnologia").apply(); 	  } 
				if(auxOrigem == "99 - Tesouraria")        { Form.fields("AUX_ORIGEM").value("99_tesouraria").apply(); 	  } 

			}			
		
		});	

		// Atualizar modelo para carregar a lista de categorias
		Form.fields("AUX_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			modelo = Form.fields("SETOR").value();
			Form.fields("AUX_MODELO").value(modelo).apply();

		});			
		
		// Carregar lista de categorias quando o modelo for atualizado
		Form.fields("AUX_MODELO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			listaCategorias(modelo, listaCat);

		});		

		// Precisa de duas funções para carregar a lista de subcategorias, uma para remover as opções e outra para carregar as opções atualizadas
		Form.fields("CATEGORIA").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("SUBCATEGORIA").value("").apply();	
			Form.fields("SUBCATEGORIA").removeOptions([]);
		
		});			

		// Carregar subcategorias referente ao modelo e a categoria selecionada
		Form.fields("CATEGORIA").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			Form.fields("AUX_ROTA").value("").apply();			
			Form.fields("PROX_ETAPA").value("").apply();
			Form.fields("PROX_RESP").value("").apply();	

			auxCat = Form.fields("CATEGORIA").value();
			listaSubcategorias(modelo, auxCat, listaSub);

		});

		// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
		Form.fields("SUBCATEGORIA").subscribe("CLICK", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();
			listaSubcategorias(modelo, auxCat, listaSub);

		});		

		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("").apply();
			Form.fields("PROX_ETAPA").value("").apply();
			Form.fields("PROX_RESP").value("").apply();		

			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();
			auxLider  = Form.fields("AUX_LIDER").value();

			if(iniciador != auxLider){ categoriaAprovaGerente(modelo, auxCat, auxSub); }

			if(auxUnidade == "99" && auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
				
				novoGrupo = "99_cons_consig";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
			
			}			
			else
			if(auxUnidade == "99" && auxCat == "Limite Cartão" && auxSub == "Limite Acima de R$45.000,00"){ 
				
				novoGrupo = "99_credito";
				Form.fields("AUX_GRUPO").value(novoGrupo).apply();
			
			}			
			else			
				Form.fields("AUX_GRUPO").value(auxGrupo).apply();
				

		});	

		// Mostrar campos de pesquisa de cliente
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {
			
			if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"         || modelo == "99_cartoes"     ||
			   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao"   || modelo == "99_cons_consig" || 
			   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"        || modelo == "99_rural"       || 
			   modelo == "99_seguros"     || modelo == "99_conectividade"  || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

				Form.fields('CPF_CNPJ').visible(true).apply();
				Form.fields('NOME_RAZAO').visible(true).apply();
				Form.fields('PESSOA_CONTA').visible(true).apply();
				
				if(modelo == "99_cadastro"){

					Form.fields('CPF_CNPJ').setRequired('aprovar', true).apply();
					Form.fields('NOME_RAZAO').setRequired('aprovar', true).apply();

				}
				else{

					Form.fields('CPF_CNPJ').setRequired('aprovar', false).apply();
					Form.fields('NOME_RAZAO').setRequired('aprovar', false).apply();

				}
					
			}
			else{

				Form.fields('CPF_CNPJ').visible(false).apply();
				Form.fields('NOME_RAZAO').visible(false).apply();
				Form.fields('PESSOA_CONTA').visible(false).apply();

				Form.fields('CPF_CNPJ').setRequired('aprovar', false).apply();
				Form.fields('NOME_RAZAO').setRequired('aprovar', false).apply();

			}

		});			
		
		// Campo chamado privado, se alterado reiniciar rota e grupo de iniciadores
		Form.fields("PRIVADO").subscribe("CHANGE", function(itemId, data, response) {
			
			Form.fields("AUX_ROTA").value("").apply();
			Form.fields("PROX_ETAPA").value("").apply();
			Form.fields("PROX_RESP").value("").apply();
			Form.fields("AUX_GRUPO_ORIGEM_NOMES").value("").apply();
			Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value("").apply();			
		
		});		

		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});				
		
		// Console linha adicionada
		Form.grids("G_ANEXOS").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});	
		
		// Definir rota de atendimento, próximos responsáveis e próxima atividade
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			// Carregar variáveis para validação
			auxRota    = Form.fields("AUX_ROTA").value();
			nomeLider  = Form.fields("AUX_NOME_LIDER").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			auxCiclo   = Form.fields("AUX_CICLO").value();
			gerenteAp  = Form.fields("AUX_APROV_LIDER").value();
			auxUserDev = Form.fields("AUX_USER_DEV").value();
			auxDevolv  = Form.fields("AUX_DEVOLUCAO").value();
			auxPriv    = Form.fields("PRIVADO").value();
			auxInicLog = Form.fields("AUX_INICIADOR").value();
			auxInicNom = Form.fields("INICIADOR").value();
			auxMembros = Form.fields("AUX_SQL_GRUPO").value();
			auxAlc2    = Form.fields("AUX_SQL_ALC2").value();
			auxAlc3    = Form.fields("AUX_SQL_ALC3").value();
			

			// Chamado já aprovado, ou aberto em categoria que não precisa de aprovação do gerente
			if(auxRota == "Registrar Chamado"){

				// Chamado novo
				if(auxCiclo == 1){ 

					if(gerenteAp == "Não"){
						Form.fields("PROX_ETAPA").value("Assumir Novo Chamado").apply();
					}
					else
					if(gerenteAp == "Sim"){
						Form.fields("PROX_ETAPA").value("Aprovar Solicitação de Atendimento").apply();
						Form.fields("PROX_RESP").value(nomeLider).apply();
					}	

					Form.actions('aprovar').disabled(false).apply();
					Form.actions('cancel').disabled(true).apply();

				}
				
				// Chamado devolvido
				if(auxCiclo > 1){ 

					if(auxDevolv == "Devolvido Alçada 1"){
						Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
						Form.fields("PROX_RESP").value(auxMembros).apply();
					}
					else
					if(auxDevolv == "Devolvido Alçada 2"){
						Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 2").apply();
						Form.fields("PROX_RESP").value(auxAlc2).apply();
					}
					else	
					if(auxDevolv == "Devolvido Alçada 3"){
						Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 3").apply();
						Form.fields("PROX_RESP").value(auxAlc3).apply();
					}									

					Form.actions('aprovar').disabled(false).apply();
					Form.actions('rejeitar').disabled(true).apply();

				}

			}		

			// Chamado cancelado pelo usuário
			if(auxRota == "Cancelar Chamado"){

				Form.fields("PROX_ETAPA").value("Arquivar Chamado").apply();
				Form.fields("PROX_RESP").value(nomeUser).apply();

				// Bloquear ações do form
				if(auxCiclo == 1){
					Form.actions('aprovar').disabled(true).apply();
					Form.actions('cancel').disabled(false).apply();
				}
				else 
				if(auxCiclo > 1){
					Form.actions('aprovar').disabled(true).apply();
					Form.actions('rejeitar').disabled(false).apply();
				}

			}

		});			
		
		// Execução de SQL com a lista de usuários do grupo de atendimento. Somente para chamado novo
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Registrar Chamado" && gerenteAp == "Não" && auxCiclo == 1)
				Form.fields("PROX_RESP").value(response).apply();

		});		

	}

	if(codigoEtapa == APROVAR_GERENTE){

		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota    = Form.fields("AUX_ROTA").value();
			auxGrupo   = Form.fields("DESTINO").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			auxMembros = Form.fields("AUX_SQL_GRUPO").value();
			
			if(auxRota == "Aprovar Solicitação"){

				Form.fields("PROX_ETAPA").value("Assumir Novo Chamado").apply();
				Form.fields("PROX_RESP").value(auxMembros).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}		
			
			if(auxRota == "Rejeitar e Cancelar"){			

				Form.fields("PROX_ETAPA").value("Arquivar Chamado").apply();
				Form.fields("PROX_RESP").value(nomeUser).apply();
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}				

		});		

	}	

	if(codigoEtapa == REALIZAR_ATENDIMENTO){
		
		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota    = Form.fields("AUX_ROTA").value();
			auxGrupo   = Form.fields("DESTINO").value();
			nomeInic   = Form.fields("INICIADOR").value();
			loginInic  = Form.fields("AUX_INICIADOR").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			modelo     = Form.fields("AUX_MODELO").value();
			auxPriv    = Form.fields("PRIVADO").value();
			auxInicNom = Form.fields("AUX_GRUPO_ORIGEM_NOMES").value();
			auxInicLog = Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value();

			// Chamado privado, volta somente para a pessoa que abriu
			if(auxPriv == "Sim"){

				auxInicNom = nomeInic;
				auxInicLog = loginInic;

				Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
				Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();

				console.log("Chamado privado");

			}
			
			// Chamado público, volta para o grupo. Se o iniciador não estiver no grupo, volta para o inciador mais o grupo
			else{

				if(auxInicLog.toString().indexOf(loginInic) == -1){

					auxInicNom = nomeInic + ", " + auxInicNom;
					auxInicLog = loginInic + "," + auxInicLog;
	
					Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
					Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();				
	
					console.log("Chamado público. Iniciador não está no grupo");
				}
				else
					console.log("Chamado público. Iniciador está no grupo");

			}
			
			if(auxRota == "Finalizar Atendimento"){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota == "Devolver ao Solicitante"){			

				console.log("grupo origem: " + auxInicLog);

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 1").apply();
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}
			if(auxRota == "Aguardando Terceiros"){

				Form.fields("PROX_ETAPA").value("Aguardando Terceiros").apply();
				Form.fields("PROX_RESP").value(nomeUser).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}	
			if(auxRota == "Submeter Alçada Nível 2"){

				alcadaNivel2(modelo, auxRota);
				Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 2").apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota == "Encaminhar Chamado"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("").apply();
				Form.fields("PROX_RESP").value("").apply();	

				// Definir campos que vão receber as listas de opções
				listaDes   = Form.fields("DESTINO_NOVO");
				listaCat   = Form.fields("CATEGORIA_NOVO");
				listaSub   = Form.fields("SUBCATEGORIA_NOVO");
				listaSetor = Form.fields("SETOR_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true).apply();
				Form.fields('CATEGORIA_NOVO').visible(true).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(true).apply();
				Form.fields('SETOR_NOVO').visible(true).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', true).apply();

				// Carregar lista de grupos
				gruposTodos(listaDes);

				// Carregar lista de setores
				listaSetores(listaSetor);

				// Atualizar destino e unidade, limpar categoria e subcategoria
				Form.fields("DESTINO_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					auxDestino = Form.fields("DESTINO_NOVO").value();
					auxUnidade = auxDestino.toString().substring(0,2);

					Form.fields("AUX_DESTINO").value(auxDestino).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);			
					
					console.log("destino: " + auxDestino);
					console.log("unidade: " + auxUnidade);

				});

				// Se for alterado o destino limpar os campos de setor
				Form.fields("AUX_DESTINO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					Form.fields("SETOR_NOVO").value("").apply();

				});			

				// Atualizar setor e modelo, caso alterado limpar categoria e subcategoria
				Form.fields("SETOR_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					// Atualizar o modelo, o grupo de origem e o grupo de destino
					modelo    = Form.fields("SETOR_NOVO").value();
					auxSetor  = modelo.toString().substring(2,30);
					auxGrupo  = auxUnidade + auxSetor;

					Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					Form.fields("AUX_MODELO").value(modelo).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

					console.log("grupo: " + auxGrupo);
					console.log("modelo: " + modelo);

				});	

				// Atualizar modelo para carregar a lista de categorias
				Form.fields("AUX_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					modelo = Form.fields("SETOR_NOVO").value();
					Form.fields("AUX_MODELO").value(modelo).apply();

				});			

				// Carregar lista de categorias quando o modelo for atualizado
				Form.fields("AUX_MODELO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					listaCategorias(modelo, listaCat);

				});		

				// Precisa de duas funções para carregar a lista de subcategorias, uma para remover as opções e outra para carregar as opções atualizadas
				Form.fields("CATEGORIA_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					Form.fields("SUBCATEGORIA_NOVO").value("").apply();	
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

				});		
				// Carregar subcategorias referente ao grupo e a categoria selecionada
				Form.fields("CATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

					auxCat = Form.fields("CATEGORIA_NOVO").value();

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					if(auxUnidade == "99" && auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
				
						novoGrupo = "99_cons_consig";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}
					else
					if(auxUnidade == "99" && auxCat == "Limite Cartão" && auxSub == "Limite Acima de R$45.000,00"){ 
						
						novoGrupo = "99_credito";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}										
					else{ 
						Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					}	
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota != "Encaminhar Chamado"){

				Form.fields('DESTINO_NOVO').visible(false).apply();
				Form.fields('CATEGORIA_NOVO').visible(false).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(false).apply();
				Form.fields('SETOR_NOVO').visible(false).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', false).apply();

			}									

		});

		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});			
		
		// Console linha adicionada
		Form.grids("G_ANEXOS").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});		

		// Atualizar responsáveis pelo atendimento na origem
		Form.fields("AUX_GRUPO_ORIGEM_NOMES").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Devolver ao Solicitante" || auxRota == "Finalizar Atendimento")
				Form.fields("PROX_RESP").value(response).apply();

		});		

		// Execução de SQL com a função de aprovadores nível 2
		Form.fields("AUX_SQL_ALC2").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Submeter Alçada Nível 2")
				Form.fields("PROX_RESP").value(response).apply();

		});	
		
		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			// Atualizar informações do chamado
			Form.fields("DESTINO").value(auxDestino).apply();
			Form.fields("SETOR").value(modelo).apply();
			Form.fields("CATEGORIA").value(auxCat).apply();
			Form.fields("SUBCATEGORIA").value(auxSub).apply();
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response).apply();

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true).apply();
		
		});			

	}		

	if(codigoEtapa == AGUARDANDO_TERCEIROS){
		
		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {

			auxRota    = Form.fields("AUX_ROTA").value();
			auxGrupo   = Form.fields("DESTINO").value();
			nomeInic   = Form.fields("INICIADOR").value();
			loginInic  = Form.fields("AUX_INICIADOR").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			modelo     = Form.fields("AUX_MODELO").value();
			auxPriv    = Form.fields("PRIVADO").value();
			auxInicNom = Form.fields("AUX_GRUPO_ORIGEM_NOMES").value();
			auxInicLog = Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value();

			if(auxPriv == "Sim"){

				auxInicNom = nomeInic;
				auxInicLog = loginInic;

				Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
				Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();

				console.log("Chamado privado");

			}
			else{

				if(auxInicLog.toString().indexOf(loginInic) == -1){

					auxInicNom = nomeInic + ", " + auxInicNom;
					auxInicLog = loginInic + "," + auxInicLog;
	
					Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
					Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();				
	
					console.log("Chamado público. Iniciador não está no grupo");
				}
				else
					console.log("Chamado público. Iniciador está no grupo");

			}		
			
			if(auxRota == "Finalizar Atendimento" ){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota == "Devolver ao Solicitante"){

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 1").apply();
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}
			if(auxRota == "Encaminhar Chamado"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("").apply();
				Form.fields("PROX_RESP").value("").apply();	

				// Definir campos que vão receber as listas de opções
				listaDes   = Form.fields("DESTINO_NOVO");
				listaCat   = Form.fields("CATEGORIA_NOVO");
				listaSub   = Form.fields("SUBCATEGORIA_NOVO");
				listaSetor = Form.fields("SETOR_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true).apply();
				Form.fields('CATEGORIA_NOVO').visible(true).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(true).apply();
				Form.fields('SETOR_NOVO').visible(true).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', true).apply();

				// Carregar lista de grupos
				gruposTodos(listaDes);

				// Carregar lista de setores
				listaSetores(listaSetor);

				// Atualizar destino e unidade, limpar categoria e subcategoria
				Form.fields("DESTINO_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					auxDestino = Form.fields("DESTINO_NOVO").value();
					auxUnidade = auxDestino.toString().substring(0,2);

					Form.fields("AUX_DESTINO").value(auxDestino).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);			
					
					console.log("destino: " + auxDestino);
					console.log("unidade: " + auxUnidade);

				});

				// Se for alterado o destino limpar os campos de setor
				Form.fields("AUX_DESTINO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					Form.fields("SETOR_NOVO").value("").apply();

				});			

				// Atualizar setor e modelo, caso alterado limpar categoria e subcategoria
				Form.fields("SETOR_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					// Atualizar o modelo, o grupo de origem e o grupo de destino
					modelo    = Form.fields("SETOR_NOVO").value();
					auxSetor  = modelo.toString().substring(2,30);
					auxGrupo  = auxUnidade + auxSetor;

					Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					Form.fields("AUX_MODELO").value(modelo).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

					console.log("grupo: " + auxGrupo);
					console.log("modelo: " + modelo);

				});	

				// Atualizar modelo para carregar a lista de categorias
				Form.fields("AUX_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					modelo = Form.fields("SETOR_NOVO").value();
					Form.fields("AUX_MODELO").value(modelo).apply();

				});			

				// Carregar lista de categorias quando o modelo for atualizado
				Form.fields("AUX_MODELO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					listaCategorias(modelo, listaCat);

				});		

				// Precisa de duas funções para carregar a lista de subcategorias, uma para remover as opções e outra para carregar as opções atualizadas
				Form.fields("CATEGORIA_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					Form.fields("SUBCATEGORIA_NOVO").value("").apply();	
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

				});		
				// Carregar subcategorias referente ao grupo e a categoria selecionada
				Form.fields("CATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

					auxCat = Form.fields("CATEGORIA_NOVO").value();

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					if(auxUnidade == "99" && auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
				
						novoGrupo = "99_cons_consig";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}
					else
					if(auxUnidade == "99" && auxCat == "Limite Cartão" && auxSub == "Limite Acima de R$45.000,00"){ 
						
						novoGrupo = "99_credito";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}										
					else{ 
						Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					}	
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota != "Encaminhar Chamado"){

				Form.fields('DESTINO_NOVO').visible(false).apply();
				Form.fields('CATEGORIA_NOVO').visible(false).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(false).apply();
				Form.fields('SETOR_NOVO').visible(false).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', false).apply();

			}									

		});

		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});			
		
		// Console linha adicionada
		Form.grids("G_ANEXOS").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});		

		// Atualizar responsáveis pelo atendimento na origem
		Form.fields("AUX_GRUPO_ORIGEM_NOMES").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Devolver ao Solicitante" || auxRota == "Finalizar Atendimento")
				Form.fields("PROX_RESP").value(response).apply();

		});			

		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			// Atualizar informações do chamado
			Form.fields("DESTINO").value(auxDestino).apply();
			Form.fields("SETOR").value(modelo).apply();
			Form.fields("CATEGORIA").value(auxCat).apply();
			Form.fields("SUBCATEGORIA").value(auxSub).apply();
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response).apply();

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true).apply();
		
		});			

	}	

	if(codigoEtapa == APROVACAO_ALCADA_2){

		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota    = Form.fields("AUX_ROTA").value();
			auxGrupo   = Form.fields("DESTINO").value();
			nomeInic   = Form.fields("INICIADOR").value();
			loginInic  = Form.fields("AUX_INICIADOR").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			modelo     = Form.fields("AUX_MODELO").value();
			auxPriv    = Form.fields("PRIVADO").value();
			auxInicNom = Form.fields("AUX_GRUPO_ORIGEM_NOMES").value();
			auxInicLog = Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value();

			if(auxPriv == "Sim"){

				auxInicNom = nomeInic;
				auxInicLog = loginInic;

				Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
				Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();

				console.log("Chamado privado");

			}
			else{

				if(auxInicLog.toString().indexOf(loginInic) == -1){

					auxInicNom = nomeInic + ", " + auxInicNom;
					auxInicLog = loginInic + "," + auxInicLog;
	
					Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
					Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();				
	
					console.log("Chamado público. Iniciador não está no grupo");
				}
				else
					console.log("Chamado público. Iniciador está no grupo");

			}
			
			if(auxRota == "Encerrar Chamado" ){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota == "Devolver ao Solicitante"){

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 2").apply();
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}
			if(auxRota == "Aprovar e Prosseguir"){

				auxMembros = Form.fields("AUX_SQL_GRUPO").value();
				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.fields("PROX_RESP").value(auxMembros).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}			
			if(auxRota == "Submeter Alçada Nível 3"){

				alcadaNivel3(modelo, auxRota);
				Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 3").apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}			
			if(auxRota == "Aprovar e Encaminhar"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("").apply();
				Form.fields("PROX_RESP").value("").apply();	

				// Definir campos que vão receber as listas de opções
				listaDes   = Form.fields("DESTINO_NOVO");
				listaCat   = Form.fields("CATEGORIA_NOVO");
				listaSub   = Form.fields("SUBCATEGORIA_NOVO");
				listaSetor = Form.fields("SETOR_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true).apply();
				Form.fields('CATEGORIA_NOVO').visible(true).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(true).apply();
				Form.fields('SETOR_NOVO').visible(true).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', true).apply();

				// Carregar lista de grupos
				gruposTodos(listaDes);

				// Carregar lista de setores
				listaSetores(listaSetor);

				// Atualizar destino e unidade, limpar categoria e subcategoria
				Form.fields("DESTINO_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					auxDestino = Form.fields("DESTINO_NOVO").value();
					auxUnidade = auxDestino.toString().substring(0,2);

					Form.fields("AUX_DESTINO").value(auxDestino).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);			
					
					console.log("destino: " + auxDestino);
					console.log("unidade: " + auxUnidade);

				});

				// Se for alterado o destino limpar os campos de setor
				Form.fields("AUX_DESTINO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					Form.fields("SETOR_NOVO").value("").apply();

				});			

				// Atualizar setor e modelo, caso alterado limpar categoria e subcategoria
				Form.fields("SETOR_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					// Atualizar o modelo, o grupo de origem e o grupo de destino
					modelo    = Form.fields("SETOR_NOVO").value();
					auxSetor  = modelo.toString().substring(2,30);
					auxGrupo  = auxUnidade + auxSetor;

					Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					Form.fields("AUX_MODELO").value(modelo).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

					console.log("grupo: " + auxGrupo);
					console.log("modelo: " + modelo);

				});	

				// Atualizar modelo para carregar a lista de categorias
				Form.fields("AUX_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					modelo = Form.fields("SETOR_NOVO").value();
					Form.fields("AUX_MODELO").value(modelo).apply();

				});			

				// Carregar lista de categorias quando o modelo for atualizado
				Form.fields("AUX_MODELO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					listaCategorias(modelo, listaCat);

				});		

				// Precisa de duas funções para carregar a lista de subcategorias, uma para remover as opções e outra para carregar as opções atualizadas
				Form.fields("CATEGORIA_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					Form.fields("SUBCATEGORIA_NOVO").value("").apply();	
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

				});		
				// Carregar subcategorias referente ao grupo e a categoria selecionada
				Form.fields("CATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

					auxCat = Form.fields("CATEGORIA_NOVO").value();

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					if(auxUnidade == "99" && auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
				
						novoGrupo = "99_cons_consig";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}	
					else
					if(auxUnidade == "99" && auxCat == "Limite Cartão" && auxSub == "Limite Acima de R$45.000,00"){ 
						
						novoGrupo = "99_credito";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}									
					else{ 
						Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					}	
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota != "Aprovar e Encaminhar"){

				Form.fields('DESTINO_NOVO').visible(false).apply();
				Form.fields('CATEGORIA_NOVO').visible(false).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(false).apply();
				Form.fields('SETOR_NOVO').visible(false).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', false).apply();

			}												

		});

		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});			
		
		// Console linha adicionada
		Form.grids("G_ANEXOS").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});		

		// Atualizar responsáveis pelo atendimento na origem
		Form.fields("AUX_GRUPO_ORIGEM_NOMES").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Devolver ao Solicitante" || auxRota == "Encerrar Chamado")
				Form.fields("PROX_RESP").value(response).apply();

		});			

		// Execução de SQL com a função de aprovadores nível 3
		Form.fields("AUX_SQL_ALC3").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Submeter Alçada Nível 3")
				Form.fields("PROX_RESP").value(response).apply();

		});	
		
		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			// Atualizar informações do chamado
			Form.fields("DESTINO").value(auxDestino).apply();
			Form.fields("SETOR").value(modelo).apply();
			Form.fields("CATEGORIA").value(auxCat).apply();
			Form.fields("SUBCATEGORIA").value(auxSub).apply();
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response).apply();

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true).apply();
		
		});				

	}	

	if(codigoEtapa == APROVACAO_ALCADA_3){

		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota    = Form.fields("AUX_ROTA").value();
			auxGrupo   = Form.fields("DESTINO").value();
			nomeInic   = Form.fields("INICIADOR").value();
			loginInic  = Form.fields("AUX_INICIADOR").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			modelo     = Form.fields("AUX_MODELO").value();
			auxPriv    = Form.fields("PRIVADO").value();
			auxInicNom = Form.fields("AUX_GRUPO_ORIGEM_NOMES").value();
			auxInicLog = Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value();

			if(auxPriv == "Sim"){

				auxInicNom = nomeInic;
				auxInicLog = loginInic;

				Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
				Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();

				console.log("Chamado privado");

			}
			else{

				if(auxInicLog.toString().indexOf(loginInic) == -1){

					auxInicNom = nomeInic + ", " + auxInicNom;
					auxInicLog = loginInic + "," + auxInicLog;
	
					Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
					Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();				
	
					console.log("Chamado público. Iniciador não está no grupo");
				}
				else
					console.log("Chamado público. Iniciador está no grupo");

			}
			
			if(auxRota == "Encerrar Chamado" ){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota == "Devolver ao Solicitante"){

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 3").apply();
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento").apply();
				Form.fields("PROX_RESP").value(auxInicNom).apply();
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}
			if(auxRota == "Aprovar e Prosseguir"){

				auxMembros = Form.fields("AUX_SQL_GRUPO").value();
				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.fields("PROX_RESP").value(auxMembros).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}							
			if(auxRota == "Aprovar e Encaminhar"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("").apply();
				Form.fields("PROX_RESP").value("").apply();	

				// Definir campos que vão receber as listas de opções
				listaDes   = Form.fields("DESTINO_NOVO");
				listaCat   = Form.fields("CATEGORIA_NOVO");
				listaSub   = Form.fields("SUBCATEGORIA_NOVO");
				listaSetor = Form.fields("SETOR_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true).apply();
				Form.fields('CATEGORIA_NOVO').visible(true).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(true).apply();
				Form.fields('SETOR_NOVO').visible(true).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', true).apply();

				// Carregar lista de grupos
				gruposTodos(listaDes);

				// Carregar lista de setores
				listaSetores(listaSetor);

				// Atualizar destino e unidade, limpar categoria e subcategoria
				Form.fields("DESTINO_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					auxDestino = Form.fields("DESTINO_NOVO").value();
					auxUnidade = auxDestino.toString().substring(0,2);

					Form.fields("AUX_DESTINO").value(auxDestino).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);			
					
					console.log("destino: " + auxDestino);
					console.log("unidade: " + auxUnidade);

				});

				// Se for alterado o destino limpar os campos de setor
				Form.fields("AUX_DESTINO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					Form.fields("SETOR_NOVO").value("").apply();

				});			

				// Atualizar setor e modelo, caso alterado limpar categoria e subcategoria
				Form.fields("SETOR_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					// Atualizar o modelo, o grupo de origem e o grupo de destino
					modelo    = Form.fields("SETOR_NOVO").value();
					auxSetor  = modelo.toString().substring(2,30);
					auxGrupo  = auxUnidade + auxSetor;

					Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					Form.fields("AUX_MODELO").value(modelo).apply();

					Form.fields("CATEGORIA_NOVO").removeOptions([]);
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

					console.log("grupo: " + auxGrupo);
					console.log("modelo: " + modelo);

				});	

				// Atualizar modelo para carregar a lista de categorias
				Form.fields("AUX_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					modelo = Form.fields("SETOR_NOVO").value();
					Form.fields("AUX_MODELO").value(modelo).apply();

				});			

				// Carregar lista de categorias quando o modelo for atualizado
				Form.fields("AUX_MODELO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
					
					listaCategorias(modelo, listaCat);

				});		

				// Precisa de duas funções para carregar a lista de subcategorias, uma para remover as opções e outra para carregar as opções atualizadas
				Form.fields("CATEGORIA_NOVO").subscribe("CHANGE", function(itemId, data, response) {

					Form.fields("SUBCATEGORIA_NOVO").value("").apply();	
					Form.fields("SUBCATEGORIA_NOVO").removeOptions([]);

				});		
				// Carregar subcategorias referente ao grupo e a categoria selecionada
				Form.fields("CATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

					auxCat = Form.fields("CATEGORIA_NOVO").value();

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					if(auxUnidade == "99" && auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
				
						novoGrupo = "99_cons_consig";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}	
					else
					if(auxUnidade == "99" && auxCat == "Limite Cartão" && auxSub == "Limite Acima de R$45.000,00"){ 
						
						novoGrupo = "99_credito";
						Form.fields("AUX_GRUPO").value(novoGrupo).apply();
					
					}									
					else{ 
						Form.fields("AUX_GRUPO").value(auxGrupo).apply();
					}	
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}
			if(auxRota != "Aprovar e Encaminhar"){

				Form.fields('DESTINO_NOVO').visible(false).apply();
				Form.fields('CATEGORIA_NOVO').visible(false).apply();
				Form.fields('SUBCATEGORIA_NOVO').visible(false).apply();
				Form.fields('SETOR_NOVO').visible(false).apply();
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false).apply();
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false).apply();
				Form.fields('SETOR_NOVO').setRequired('aprovar', false).apply();

			}	

		});	
		
		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});			
		
		// Console linha adicionada
		Form.grids("G_ANEXOS").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});		
			
		// Atualizar responsáveis pelo atendimento na origem
		Form.fields("AUX_GRUPO_ORIGEM_NOMES").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Devolver ao Solicitante" || auxRota == "Encerrar Chamado")
				Form.fields("PROX_RESP").value(response).apply();

		});				
			
		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {

			// Atualizar informações do chamado
			Form.fields("DESTINO").value(auxDestino).apply();
			Form.fields("SETOR").value(modelo).apply();
			Form.fields("CATEGORIA").value(auxCat).apply();
			Form.fields("SUBCATEGORIA").value(auxSub).apply();
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response).apply();

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true).apply();
		
		});				

	}

	if(codigoEtapa == AVALIAR_ATENDIMENTO){

		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota    = Form.fields("AUX_ROTA").value();
			auxGrupo   = Form.fields("DESTINO").value();
			nomeInic   = Form.fields("INICIADOR").value();
			loginInic  = Form.fields("AUX_INICIADOR").value();
			nomeUser   = Form.fields("AUX_NOME_SER").value();
			modelo     = Form.fields("AUX_MODELO").value();
			auxMembros = Form.fields("AUX_SQL_GRUPO").value();
			auxPriv    = Form.fields("PRIVADO").value();
			auxInicNom = Form.fields("AUX_GRUPO_ORIGEM_NOMES").value();
			auxInicLog = Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value();

			if(auxPriv == "Sim"){

				auxInicNom = nomeInic;
				auxInicLog = loginInic;

				Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
				Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();

				console.log("Chamado privado");

			}
			else{

				if(auxInicLog.toString().indexOf(loginInic) == -1){

					auxInicNom = nomeInic + ", " + auxInicNom;
					auxInicLog = loginInic + "," + auxInicLog;
	
					Form.fields("AUX_GRUPO_ORIGEM_NOMES").value(auxInicNom).apply();
					Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value(auxInicLog).apply();				
	
					console.log("Chamado público. Iniciador não está no grupo");
				}
				else
					console.log("Chamado público. Iniciador está no grupo");

			}
			
			if(auxRota == "Arquivar Chamado" ){

				Form.fields("AVALIACAO").visible(true).apply();
				Form.fields("AV_ADICIONAL").visible(true).apply();
				Form.fields('AVALIACAO').setRequired('aprovar', true).apply();

				listaAvaliacao();

				Form.fields("PROX_ETAPA").value("Arquivar Chamado").apply();
				Form.fields("PROX_RESP").value(nomeUser).apply();
				Form.actions('aprovar').disabled(false).apply();
				Form.actions('rejeitar').disabled(true).apply();

			}		
			
			if(auxRota == "Reabrir Chamado" ){

				Form.fields("AVALIACAO").visible(false).apply();
				Form.fields("AV_ADICIONAL").visible(false).apply();
				Form.fields('AVALIACAO').setRequired('aprovar', false).apply();				

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.fields("PROX_RESP").value(auxMembros).apply();
				Form.actions('aprovar').disabled(true).apply();
				Form.actions('rejeitar').disabled(false).apply();

			}				

		});	

		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});			
		
		// Console linha adicionada
		Form.grids("G_ANEXOS").subscribe("GRID_SUBMIT", function (itemId, data, response) {
					
			console.log(response);

		});		
		
		Form.fields("AVALIACAO").subscribe("CHANGE", function(itemId, data, response) {

			auxAval = response;

			if(auxAval == "Ruim" || auxAval == "Muito Ruim"){
				Form.fields('AV_ADICIONAL').setRequired('aprovar', true).apply();
			}
			else{
				Form.fields('AV_ADICIONAL').setRequired('aprovar', false).apply();
			}
	
		});		

	}
	
	Form.apply();
}


/*
 * Formata o formulário
 */
function setForm(){

	if(codigoEtapa == REGISTRAR_CHAMADO){

		//Carregar varáveis iniciais
		auxCiclo  = Form.fields("AUX_CICLO").value();
		auxOrigem = Form.fields("ORIGEM").value();

		//Limpar campos iniciais
		Form.fields("AUX_ROTA").value("").apply();
		Form.fields("PROX_ETAPA").value("").apply();
		Form.fields("PROX_RESP").value("").apply();
		
		// Definir quais campos vão receber as listas de opções
		listaDes   = Form.fields("DESTINO");
		listaSetor = Form.fields("SETOR");
		listaCat   = Form.fields("CATEGORIA");
		listaSub   = Form.fields("SUBCATEGORIA");

		// Carregar lista de rotas
		listaRotas();		

		// Carregar lista de unidades
		gruposTodos(listaDes);

		// Carregar lista de setores
		listaSetores(listaSetor);

		// Chamado novo
		if(auxCiclo == 1){

			Form.actions('aprovar').disabled(true).apply();
			Form.actions('cancel').disabled(true).apply();

		}
		// Chamado devolvido
		else 
		if(auxCiclo > 1){

			modelo     = Form.fields("AUX_MODELO").value();
			auxCat     = Form.fields("CATEGORIA").value();
			auxDestino = Form.fields("AUX_DESTINO").value();

			Form.fields("DESTINO").value(auxDestino).apply();
			Form.fields("DESTINO").disabled(true).apply();
			Form.fields("SETOR").disabled(true).apply();
			Form.fields("CATEGORIA").disabled(true).apply();
			Form.fields("SUBCATEGORIA").disabled(true).apply();
			Form.fields("ASSUNTO").disabled(true).apply();
			Form.fields("DESCRICAO").disabled(true).apply();

			if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"         || modelo == "99_cartoes"     ||
			   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao"   || modelo == "99_cons_consig" || 
			   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"        || modelo == "99_rural"       || 
			   modelo == "99_seguros"     || modelo == "99_conectividade"  || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

				Form.fields("CPF_CNPJ").disabled(true).apply();
				Form.fields("NOME_RAZAO").disabled(true).apply();
				Form.fields("PESSOA_CONTA").disabled(true).apply();
				Form.fields('CPF_CNPJ').visible(true).apply();
				Form.fields('NOME_RAZAO').visible(true).apply();
				Form.fields('PESSOA_CONTA').visible(true).apply();

				if(modelo == "99_cadastro" && auxCat == "Inclusão/Exclusão de Bens"){

					Form.fields('BEM_AQUISICAO').visible(true).apply();
					Form.fields("BEM_AQUISICAO").disabled(true).apply();

				}
					
			}			

			Form.fields('HISTORICO').setRequired('aprovar', true).apply();

			Form.actions('aprovar').disabled(true).apply();
			Form.actions('rejeitar').disabled(true).apply();

		}
			
	}	
	
	if(codigoEtapa == ASSUMIR_NOVO || codigoEtapa == ASSUMIR_ANDAMENTO){ 

		// Carregar variáveis iniciais
		listaDes   = Form.fields("DESTINO");
		listaSetor = Form.fields("SETOR");
		nomeUser   = Form.fields("AUX_NOME_SER").value();
		modelo     = Form.fields("AUX_MODELO").value();

		// Definir se o destino é um grupo de PA ou da UAD
		listaSetores(listaSetor);
		gruposTodos(listaDes);

		// Mostrar campo pessoa
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"       || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao" || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"      || modelo == "99_rural"       || 
		   modelo == "99_seguros"     ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			Form.fields('CPF_CNPJ').visible(true).apply();
			Form.fields('NOME_RAZAO').visible(true).apply();
			Form.fields('PESSOA_CONTA').visible(true).apply();
		
			Form.fields('CPF_CNPJ').readOnly(true).apply();
			Form.fields('NOME_RAZAO').readOnly(true).apply();
			Form.fields('PESSOA_CONTA').readOnly(true).apply();
			 
	 	}		

		// Definir a próxima etapa e o próximo responsável
		Form.fields("PROX_ETAPA").value("Realizar Atendimento").apply();
		Form.fields("PROX_RESP").value(nomeUser).apply();		

	 }	

	if(codigoEtapa == REALIZAR_ATENDIMENTO || codigoEtapa == AGUARDANDO_TERCEIROS || codigoEtapa == APROVAR_GERENTE ||
	   codigoEtapa == APROVACAO_ALCADA_2 || codigoEtapa == APROVACAO_ALCADA_3 || codigoEtapa == AVALIAR_ATENDIMENTO){

		// Limpar campos de ação	
		Form.fields("AUX_ROTA").value("").apply();	
		Form.fields("PROX_ETAPA").value("").apply();
		Form.fields("PROX_RESP").value("").apply();	
		
		// Limpar campos para encaminhar chamado
		Form.fields("DESTINO_NOVO").value("").apply();
		Form.fields("SETOR_NOVO").value("").apply();
		Form.fields("CATEGORIA_NOVO").value("").apply();
		Form.fields("SUBCATEGORIA_NOVO").value("").apply();		

		// Carregar variáveis iniciais
		listaDes   = Form.fields("DESTINO");
		listaSetor = Form.fields("SETOR");
		nomeUser   = Form.fields("AUX_NOME_SER").value();
		auxDestino = Form.fields("DESTINO").value();
		modelo     = Form.fields("AUX_MODELO").value();

		// Definir se o destino é um grupo de PA ou da UAD
		listaSetores(listaSetor);
		gruposTodos(listaDes);

		// Mostrar campo pessoa
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"       || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao" || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"      || modelo == "99_rural"       || 
		   modelo == "99_seguros"     ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			Form.fields('CPF_CNPJ').visible(true).apply();
			Form.fields('NOME_RAZAO').visible(true).apply();
			Form.fields('PESSOA_CONTA').visible(true).apply();
		
			Form.fields('CPF_CNPJ').readOnly(true).apply();
			Form.fields('NOME_RAZAO').readOnly(true).apply();
			Form.fields('PESSOA_CONTA').readOnly(true).apply();
			 
	 	}			

		// Carregar lista rotas atendimento UAD
		if(auxDestino.toString().substring(0,2) == "99"){
			listaRotas();
		}
		// Carregar lista rotas atendimento PA
		else
		if(auxDestino.toString().substring(0,2) != "99"){
			listaRotasPA();
		}		

		Form.actions('aprovar').disabled(true).apply();
		Form.actions('rejeitar').disabled(true).apply();

	}		

	if(codigoEtapa == ARQUIVAR_CHAMADO){ 

		// Carregar variáveis iniciais
		listaDes   = Form.fields("DESTINO");
		listaSetor = Form.fields("SETOR");
		nomeUser   = Form.fields("AUX_NOME_SER").value();
		modelo     = Form.fields("AUX_MODELO").value();

		// Definir se o destino é um grupo de PA ou da UAD
		listaSetores(listaSetor);
		gruposTodos(listaDes);

		// Mostrar campo pessoa
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"       || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao" || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"      || modelo == "99_rural"       || 
		   modelo == "99_seguros"     ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			Form.fields('CPF_CNPJ').visible(true).apply();
			Form.fields('NOME_RAZAO').visible(true).apply();
			Form.fields('PESSOA_CONTA').visible(true).apply();
		
			Form.fields('CPF_CNPJ').readOnly(true).apply();
			Form.fields('NOME_RAZAO').readOnly(true).apply();
			Form.fields('PESSOA_CONTA').readOnly(true).apply();
			 
	 	}		

	}		

	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators(){

	// Validar parecer obrigatório limite de catão e grid da primeira atividade
	if(codigoEtapa == REGISTRAR_CHAMADO){
		
		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
			
			debugger;

			if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "G_ANEXOS", "quantidade": "0" })){
				reject();
				Form.apply();
			}

			debugger;

		});	

	}

	// Validar grid anexos não carregados
	if(codigoEtapa == AGUARDANDO_TERCEIROS || codigoEtapa == APROVACAO_ALCADA_2 ||
	   codigoEtapa == REALIZAR_ATENDIMENTO || codigoEtapa == APROVACAO_ALCADA_3 || codigoEtapa == AVALIAR_ATENDIMENTO){	

		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
			
			debugger;

			if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "G_ANEXOS", "quantidade": "0" })){
				reject();
				Form.apply();
			}

			debugger;

		});

		Form.actions("rejeitar").subscribe("SUBMIT", function (itemId, action, reject) {
			
			debugger;

			if(!JSPadrao.validaPreenchimentoMinimoItensGridValidaCamposGrid({ "grid": "G_ANEXOS", "quantidade": "0" })){
				reject();
				Form.apply();
			}

			debugger;

		});	

	}	

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

function alcadaNivel2(auxGrupo, auxRota){

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

}

function alcadaNivel3(auxGrupo, auxRota){

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

}

function listaSetores(lista){

	lista.addOptions([
		{ name: 'Administrativo',                 value: '99_administrativo' },
		{ name: 'Agência Virtual',                value: '99_agenciavirtual' },
		{ name: 'Adquirencia',                    value: '99_adquirencia'    },
		{ name: 'Cadastro',                       value: '99_cadastro'       },
		{ name: 'Câmbio',                         value: '99_cambio'         },
		{ name: 'Cartões',                        value: '99_cartoes'        },
		{ name: 'Cobrança Adm',                   value: '99_cob_adm'        },
		{ name: 'Cobrança Bancária',              value: '99_cobranca'       },
		{ name: 'Compensação',                    value: '99_compensascao'   },
		{ name: 'Consórcio / Consignado / Previ', value: '99_cons_consig'    },
		{ name: 'Conectividade',                  value: '99_conectividade'  },
		{ name: 'Contabilidade',                  value: '99_contabilidade'  },
		{ name: 'Contas a Pagar',                 value: '99_contas_pagar'   },
		{ name: 'Correspondente',                 value: '99_correspondente' },
		{ name: 'Crédito Comercial',              value: '99_credito'        },
		{ name: 'Crédito Rural',                  value: '99_rural'          },
		{ name: 'Governança',                     value: '99_governanca'     },
		{ name: 'Marketing',                      value: '99_marketing'      },
		{ name: 'Processos',                      value: '99_processos'      },
		{ name: 'PLD',                            value: '99_pld'            },
		{ name: 'RH / Gestão de Pessoas',         value: '99_rh'             },
		{ name: 'Seguros',                        value: '99_seguros'        },
		{ name: 'Tecnologia',                     value: '99_tecnologia'     },
		{ name: 'Tesouraria',                     value: '99_tesouraria'     },			
	]).apply();	

}

function listaRotas(){

	var lista = Form.fields("AUX_ROTA");

	if(codigoEtapa == REGISTRAR_CHAMADO){

		lista.addOptions([
			{ name: 'Registrar Chamado', value: 'Registrar Chamado'},
			{ name: 'Cancelar Chamado',  value: 'Cancelar Chamado' },
		]).apply();

	}

	if(codigoEtapa == APROVAR_GERENTE){

		lista.addOptions([
			{ name: 'Aprovar Solicitação', value: 'Aprovar Solicitação' },
			{ name: 'Rejeitar e Cancelar', value: 'Rejeitar e Cancelar' },
		]).apply();

	}	

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
			{ name: 'Aprovar e Prosseguir',    value: 'Aprovar e Prosseguir'    },
			{ name: 'Aprovar e Encaminhar',    value: 'Aprovar e Encaminhar'    },
			{ name: 'Submeter Alçada Nível 3', value: 'Submeter Alçada Nível 3' },
			{ name: 'Devolver ao Solicitante', value: 'Devolver ao Solicitante' },
			{ name: 'Encerrar Chamado',        value: 'Encerrar Chamado'        },
		]).apply();

	}	

	if(codigoEtapa == APROVACAO_ALCADA_3){

		lista.addOptions([
			{ name: 'Aprovar e Prosseguir',    value: 'Aprovar e Prosseguir'    },
			{ name: 'Aprovar e Encaminhar',    value: 'Aprovar e Encaminhar'    },
			{ name: 'Devolver ao Solicitante', value: 'Devolver ao Solicitante' },
			{ name: 'Encerrar Chamado',        value: 'Encerrar Chamado'        },
		]).apply();

	}	

	if(codigoEtapa == AGUARDANDO_TERCEIROS){

		lista.addOptions([
			{ name: 'Finalizar Atendimento',   value: 'Finalizar Atendimento'   },
			{ name: 'Encaminhar Chamado',      value: 'Encaminhar Chamado'      },
			{ name: 'Devolver ao Solicitante', value: 'Devolver ao Solicitante' },
		]).apply();

	}
	
	if(codigoEtapa == AVALIAR_ATENDIMENTO){

		lista.addOptions([
			{ name: 'Arquivar Chamado', value: 'Arquivar Chamado' },
			{ name: 'Reabrir Chamado',  value: 'Reabrir Chamado'  },
		]).apply();

	}	

}

function listaRotasPA(){

	var lista = Form.fields("AUX_ROTA");

	if(codigoEtapa == REALIZAR_ATENDIMENTO){

		lista.addOptions([
			{ name: 'Finalizar Atendimento',   value: 'Finalizar Atendimento'   },
			{ name: 'Encaminhar Chamado',      value: 'Encaminhar Chamado'      },
			{ name: 'Devolver ao Solicitante', value: 'Devolver ao Solicitante' },
		]).apply();	

	}

	if(codigoEtapa == AVALIAR_ATENDIMENTO){

		lista.addOptions([
			{ name: 'Arquivar Chamado', value: 'Arquivar Chamado' },
			{ name: 'Reabrir Chamado',  value: 'Reabrir Chamado'  },
		]).apply();

	}	

}

function listaAvaliacao(){

	var lista = Form.fields("AVALIACAO");

	lista.addOptions([
		{ name: 'Muito Bom',  value: 'Muito Bom'  },
		{ name: 'Bom',        value: 'Bom'        },
		{ name: 'Regular',    value: 'Regular'    },
		{ name: 'Ruim',       value: 'Ruim'       },
		{ name: 'Muito Ruim', value: 'Muito Ruim' },
	]).apply();	

}

function gruposTodos(lista){

	lista.addOptions([
		{ name: '99 - Unidade Administrativa', value: '99_administrativo' },
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

function listaCategorias(grupo, lista){

	if(grupo == "99_administrativo") { categoriasAdministrativo(lista); } else
	if(grupo == "99_agenciavirtual") { categoriasAgenciaVirtual(lista); } else
	if(grupo == "99_adquirencia")    { categoriasAdquirencia   (lista); } else
	if(grupo == "99_cons_consig")    { categoriasConsorcio     (lista); } else
	if(grupo == "99_cadastro")       { categoriasCadastro      (lista); } else
	if(grupo == "99_cambio")         { categoriasCambio        (lista); } else
	if(grupo == "99_cartoes")        { categoriasCartoes       (lista); } else
	if(grupo == "99_cob_adm")        { categoriasCobrancaAdm   (lista); } else
	if(grupo == "99_cobranca") 		 { categoriasCobranca      (lista); } else
	if(grupo == "99_compensascao")   { categoriasCompensacao   (lista); } else
	if(grupo == "99_conectividade")  { categoriasConectividade (lista); } else
	if(grupo == "99_contabilidade")  { categoriasContabilidade (lista); } else
	if(grupo == "99_contas_pagar")   { categoriasContasPagar   (lista); } else
	if(grupo == "99_correspondente") { categoriasCorrespondente(lista); } else
	if(grupo == "99_credito") 		 { categoriasCredito       (lista); } else
	if(grupo == "99_rural")          { categoriasRural         (lista); } else
	if(grupo == "99_governanca")     { categoriasGovernanca    (lista); } else
	if(grupo == "99_marketing")      { categoriasMarketing     (lista); } else
	if(grupo == "99_processos")      { categoriasProcessos     (lista); } else
	if(grupo == "99_pld")            { categoriasPLD           (lista); } else
	if(grupo == "99_rh")             { categoriasRH            (lista); } else
	if(grupo == "99_seguros")        { categoriasSeguro        (lista); } else
	if(grupo == "99_tecnologia")     { categoriasTecnologia    (lista); } else
	if(grupo == "99_tesouraria")     { categoriasTesouraria    (lista); } 

}

function listaSubcategorias(grupo, categoria, lista){

	if(grupo == "99_adquirencia")    { subcategoriasAdquirencia    (categoria, lista); } else
	if(grupo == "99_agenciavirtual") { subcategoriasAgenciaVirtual (categoria, lista); } else
	if(grupo == "99_cons_consig")    { subcategoriasConsorcio      (categoria, lista); } else
	if(grupo == "99_cadastro")       { subcategoriasCadastro       (categoria, lista); } else
	if(grupo == "99_cartoes")        { subcategoriasCartoes        (categoria, lista); } else
	if(grupo == "99_cobranca")       { subcategoriasCobranca       (categoria, lista); } else
	if(grupo == "99_compensascao")   { subcategoriasCompensacao    (categoria, lista); } else
	if(grupo == "99_credito")        { subcategoriasCredito        (categoria, lista); } else
	if(grupo == "99_rural")          { subcategoriasRural          (categoria, lista); } else
	if(grupo == "99_rh")             { subcategoriasRH             (categoria, lista); } else
	if(grupo == "99_seguros")        { subcategoriasSeguro         (categoria, lista); } else
	if(grupo == "99_administrativo") { subcategoriasAdministrativo (categoria, lista); } else
	if(grupo == "99_cambio")         { subcategoriasCambio         (categoria, lista); } else
	if(grupo == "99_cob_adm")        { subcategoriasCobrancaAdm    (categoria, lista); } else
	if(grupo == "99_conectividade")  { subcategoriasConectividade  (categoria, lista); } else
	if(grupo == "99_contabilidade")  { subcategoriasContabilidade  (categoria, lista); } else
	if(grupo == "99_contas_pagar")   { subcategoriasContasPagar    (categoria, lista); } else
	if(grupo == "99_correspondente") { subcategoriasCorrespondente (categoria, lista); } else
	if(grupo == "99_governanca")     { subcategoriasGovernanca     (categoria, lista); } else
	if(grupo == "99_marketing")      { subcategoriasMarketing      (categoria, lista); } else
	if(grupo == "99_processos")      { subcategoriasProcessos      (categoria, lista); } else
	if(grupo == "99_pld")            { subcategoriasPLD            (categoria, lista); } else
	if(grupo == "99_tecnologia")     { subcategoriasTecnologia     (categoria, lista); } else
	if(grupo == "99_tesouraria")     { subcategoriasTesouraria     (categoria, lista); } 

}

function categoriaAprovaGerente(modelo, categoria, subcategoria){

	if(modelo == "99_seguros"){

		if(categoria == "Sinistros" && subcategoria == "Recusas")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	} 
	else
	if(modelo == "99_cartoes"){

		if( (categoria == "Estorno / Isenção"  && subcategoria == "Anuidade"                   ) ||
		    (categoria == "Estorno / Isenção"  && subcategoria == "Pagamento em Duplicidade"   ) ||
			(categoria == "Outros"             && subcategoria == "Outros"                     ) ||
			(categoria == "Cartão Puro Débito" && subcategoria == "Solicitação"                ) ||
			(categoria == "Limite Cartão"      && subcategoria == "Cancelamento de Limite"     ) ||
			(categoria == "Limite Cartão"      && subcategoria == "Limite Acima de R$45.000,00") )
			
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99_adquirencia"){

		if(categoria == "Reembolso Aluguel" && subcategoria == "Solicitações em Geral")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99_cambio"){

		if(categoria == "Suporte ao Produto" && subcategoria == "Solicitação de Limite de Cãmbio")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99_correspondente"){

		if(categoria == "Suporte ao Produto" && subcategoria == "Abertura de Correspondente Bancário")
			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99_compensascao"){

		if( (categoria == "Estornos" 			   && subcategoria == "Tarifas / Juros/ IOF / Outros") ||
			(categoria == "Prorrogação Fechamento" && subcategoria == "Fechamento Cooperativa"       ) )

			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99_conectividade"){

		if( (categoria == "Conectividade" && subcategoria == "TAG"                         ) ||
		    (categoria == "Conectividade" && subcategoria == "Telefonia Móvel"             ) ||
			(categoria == "Conectividade" && subcategoria == "Monitoramento e Rastreamento") )

			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99_tecnologia"){

		if( (categoria == "Permissões de Acesso" && subcategoria == "Sisbr"              ) ||
		    (categoria == "Permissões de Acesso" && subcategoria == "Servidor (F)/Pastas") ||
			(categoria == "Permissões de Acesso" && subcategoria == "Sites"              ) )

			{ Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }

		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}		
	else
	if(modelo == "99_rh"){

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
	if(modelo == "99_agenciavirtual"){

		if(categoria == "Agência Virtual" && subcategoria == "Transferência de Carteira")

		  { Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}
	else
	if(modelo == "99_marketing"){

		if(categoria == "Comunicação e Marketing" && subcategoria == "Publicação Site/Redes Sociais")

		  { Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}	
	else
	if(modelo == "99_credito"){

		if(categoria == "CRL" && subcategoria == "Alteração CRL Cartão")

		  { Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}		

}

function categoriasTecnologia(lista){

	lista.addOptions([
		{ name: 'Suporte Sistemas Internos',     value: 'Suporte Sistemas Internos'    },
		{ name: 'Suporte Canais de Atendimento', value: 'Suporte Canais de Atendimento'},
		{ name: 'Equipamentos',                  value: 'Equipamentos'                 },
		{ name: 'Permissões de Acesso',          value: 'Permissões de Acesso'         },
		{ name: 'Prorrogação de Desligamento',   value: 'Prorrogação de Desligamento'  },
	]).apply();
}	

function subcategoriasTecnologia(categoria, lista){

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
			{ name: 'Servidor (F)/Pastas', value: 'Servidor (F)/Pastas'},// Gerente aprova
			{ name: 'Sites',               value: 'Sites'              },// Gerente aprova
			{ name: 'Novo Colaborador',    value: 'Novo Colaborador'   },
			{ name: 'Outros',              value: 'Outros'             },// Exigir evidência
		]).apply();

	}	
	else
	if(categoria == "Prorrogação de Desligamento"){

		lista.addOptions([	
			{ name: 'Prorrogar Desligamento de Computadores', value: 'Prorrogar Desligamento de Computadores'},// Exigir evidência
		]).apply();

	}	

}

function categoriasCobranca(lista){

	lista.addOptions([
		{ name: 'Suporte ao Produto',                 value: 'Suporte ao Produto'                },
		{ name: 'Habilitação de Serviços',            value: 'Habilitação de Serviços'           },
		{ name: 'Homologação - Abertura de Processo', value: 'Homologação - Abertura de Processo'},
	]).apply();
}

function subcategoriasCobranca(categoria, lista){

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

function categoriasConsorcio(lista){

	lista.addOptions([
		{ name: 'Consórcio',  value: 'Consórcio' },
		{ name: 'Consignado', value: 'Consignado'},
		{ name: 'Previ',      value: 'Previ'     },
	]).apply();

}

function subcategoriasConsorcio(categoria, lista){

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

function categoriasSeguro(lista){

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

function subcategoriasSeguro(categoria, lista){

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

function categoriasRural(lista){

	lista.addOptions([
		{ name: 'Crédito Rural',       value: 'Crédito Rural'      },
		{ name: 'Financiamento BNDES', value: 'Financiamento BNDES'},
	]).apply();

}

function subcategoriasRural(categoria, lista){

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

function categoriasCredito(lista){

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

function subcategoriasCredito(categoria, lista){

	if(categoria == "CRL"){

		lista.addOptions([	
			{ name: 'Pessoa Física',           value: 'Pessoa Física'          },
			{ name: 'Pessoa Jurídica',         value: 'Pessoa Jurídica'        },
			{ name: 'Pessoa Jurídica (Maior)', value: 'Pessoa Jurídica (Maior)'},
			{ name: 'Alteração CRL Cartão',    value: 'Alteração CRL Cartão'   },
			{ name: 'Consignado/Consórcio',    value: 'Consignado/Consórcio'   },// Consórcio atende
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

function categoriasCobrancaAdm(lista){

	lista.addOptions([
		{ name: 'Óbito',   value: 'Óbito'  },
		{ name: 'Dúvidas', value: 'Dúvidas'},
	]).apply();

}

function subcategoriasCobrancaAdm(categoria, lista){

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

function categoriasCartoes(lista){

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

function subcategoriasCartoes(categoria, lista){

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
			{ name: 'Solicitação',                  value: 'Solicitação'               },
			{ name: 'Majoração',                    value: 'Majoração'                 },
			{ name: 'Cancelamento de Limite',       value: 'Cancelamento de Limite'    },
			{ name: 'Limite Acima de R$45.000,00',  value: 'Limite Acima de R$45.000,00'},// Crédito Atende
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

function categoriasAdquirencia(lista){

	lista.addOptions([
		{ name: 'Suporte ao Produto',          value: 'Suporte ao Produto'         },
		{ name: 'Credenciamento',              value: 'Credenciamento'             },
		{ name: 'Negociação de Taxas',         value: 'Negociação de Taxas'        },
		{ name: 'Reembolso Aluguel',           value: 'Reembolso Aluguel'          },
		{ name: 'Relatórios',                  value: 'Relatórios'                 },
		{ name: 'Troca de Domicílio Bancário', value: 'Troca de Domicílio Bancário'},
	]).apply();

}

function subcategoriasAdquirencia(categoria, lista){

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

function categoriasCambio(lista){

	lista.addOptions([
		{ name: 'Suporte ao Produto', value: 'Suporte ao Produto'},
	]).apply();

}

function subcategoriasCambio(categoria, lista){

	if(categoria == "Suporte ao Produto"){

		lista.addOptions([	
			{ name: 'Solicitação de Limite de Cãmbio', value: 'Solicitação de Limite de Cãmbio'},// Gerente aprova
			{ name: 'Dúvidas',                         value: 'Dúvidas'                        },
		]).apply();

	}

}

function categoriasCorrespondente(lista){

	lista.addOptions([
		{ name: 'Novo Correspondente', value: 'Novo Correspondente'},
	]).apply();

}

function subcategoriasCorrespondente(categoria, lista){

	if(categoria == "Novo Correspondente"){

		lista.addOptions([	
			{ name: 'Abertura de Correspondente Bancário', value: 'Abertura de Correspondente Bancário'},// Gerente aprova
		]).apply();

	}

}

function categoriasCadastro(lista){

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

function subcategoriasCadastro(categoria, lista){

	if(categoria == "Atualização Pessoa Física"){

		lista.addOptions([	
			{ name: 'Representante Legal/Procurador',       value: 'Representante Legal/Procurador'     },
			{ name: 'Consignado INSS',                      value: 'Consignado INSS'                    },
			{ name: 'Consignado Privado',                   value: 'Consignado Privado'                 },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',       value: 'Consórcio/Sipag/Cartões/Câmbio'     },
			{ name: 'Inclusão/Exclusão de Relacionamento',  value: 'Inclusão/Exclusão de Relacionamento'},
			{ name: 'Atualização Cadastral',                value: 'Atualização Cadastral'              },
		]).apply();

	}
	else
	if(categoria == "Atualização Pessoa Jurídica"){

		lista.addOptions([	
			{ name: 'Representante Legal/Procurador',       value: 'Representante Legal/Procurador'     },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',       value: 'Consórcio/Sipag/Cartões/Câmbio'     },
			{ name: 'Inclusão/Exclusão de Relacionamento',  value: 'Inclusão/Exclusão de Relacionamento'},
			{ name: 'Atualização Cadastral',                value: 'Atualização Cadastral'              },
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

function categoriasCompensacao(lista){

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

function subcategoriasCompensacao(categoria, lista){

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

function categoriasPLD(lista){

	lista.addOptions([
		{ name: 'Análise de Ocorrências', value: 'Análise de Ocorrências'},
	]).apply();

}

function subcategoriasPLD(categoria, lista){

	if(categoria == "Análise de Ocorrências"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},// Gerente aprova
		]).apply();

	}

}

function categoriasGovernanca(lista){

	lista.addOptions([
		{ name: 'Informações Para ATA', value: 'Informações Para ATA'},
	]).apply();

}

function subcategoriasGovernanca(categoria, lista){

	if(categoria == "Informações Para ATA"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}

}

function categoriasTesouraria(lista){

	lista.addOptions([
		{ name: 'Suporte Caixa e Tesouraria', value: 'Suporte Caixa e Tesouraria'},
	]).apply();

}

function subcategoriasTesouraria(categoria, lista){

	if(categoria == "Suporte Caixa e Tesouraria"){

		lista.addOptions([	
			{ name: 'Termos',         value: 'Termos'        },
			{ name: 'Justificativas', value: 'Justificativas'},
			{ name: 'Dúvidas',        value: 'Dúvidas'       },
		]).apply();

	}

}

function categoriasContabilidade(lista){

	lista.addOptions([
		{ name: 'Movimento de Caixa' , value: 'Movimento de Caixa'},
		{ name: 'Imobilizado',         value: 'Imobilizado'       },
		{ name: 'Dúvidas',             value: 'Dúvidas'           },
		{ name: 'Contratos',           value: 'Contratos'         },
		{ name: 'Alvará',              value: 'Alvará'            },
	]).apply();

}

function subcategoriasContabilidade(categoria, lista){

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

function categoriasContasPagar(lista){

	lista.addOptions([
		{ name: 'Comprovante de Pagamento', value: 'Comprovante de Pagamento'},
		{ name: 'Pagamento a Fornecedores', value: 'Pagamento a Fornecedores'},
	]).apply();

}

function subcategoriasContasPagar(categoria, lista){

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

function categoriasRH(lista){

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

function subcategoriasRH(categoria, lista){

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

function categoriasAdministrativo(lista){

	lista.addOptions([
		{ name: 'Solciitação de Material de Expediente', value: 'Solciitação de Material de Expediente'},
	]).apply();

}

function subcategoriasAdministrativo(categoria, lista){

	if(categoria == "Solciitação de Material de Expediente"){

		lista.addOptions([	
			{ name: 'Solicitações em Geral', value: 'Solicitações em Geral'},
		]).apply();

	}

}

function categoriasMarketing(lista){

	lista.addOptions([
		{ name: 'Comunicação e Marketing', value: 'Comunicação e Marketing'},
	]).apply();

}

function subcategoriasMarketing(categoria, lista){

	if(categoria == "Comunicação e Marketing"){

		lista.addOptions([	
			{ name: 'Criação de Arte',               value: 'Criação de Arte'              },
			{ name: 'Publicação Site/Redes Sociais', value: 'Publicação Site/Redes Sociais'},
			{ name: 'Eventos',                       value: 'Eventos'                      },
			{ name: 'Outros',                        value: 'Outros'                       },
		]).apply();

	}

}

function categoriasProcessos(lista){

	lista.addOptions([
		{ name: 'Gestão de Demandas', value: 'Gestão de Demandas'},
	]).apply();

}

function subcategoriasProcessos(categoria, lista){

	if(categoria == "Gestão de Demandas"){

		lista.addOptions([	
			{ name: 'Novo Processo',         value: 'Novo Processo'       },
			{ name: 'Sugestão de Melhoria',  value: 'Sugestão de Melhoria'},
			{ name: 'Dúvidas',               value: 'Dúvidas'             },
		]).apply();

	}

}

function categoriasConectividade(lista){

	lista.addOptions([
		{ name: 'Conectividade', value: 'Conectividade'},
	]).apply();

}

function subcategoriasConectividade(categoria, lista){

	if(categoria == "Conectividade"){

		lista.addOptions([	
			{ name: 'TAG',                          value: 'TAG'                         },
			{ name: 'Telefonia Móvel',              value: 'Telefonia Móvel'             },
			{ name: 'Monitoramento e Rastreamento', value: 'Monitoramento e Rastreamento'},
		]).apply();

	}

}

function categoriasAgenciaVirtual(lista){

	lista.addOptions([
		{ name: 'Agência Virtual', value: 'Agência Virtual'},
	]).apply();

}

function subcategoriasAgenciaVirtual(categoria, lista){

	if(categoria == "Agência Virtual"){

		lista.addOptions([	
			{ name: 'Dúvidas',                   value: 'Dúvidas'                  },
			{ name: 'Transferência de Carteira', value: 'Transferência de Carteira'},
		]).apply();

	}

}