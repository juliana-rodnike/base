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
var auxGrupo     = "";
var auxInicNom   = "";
var auxInicLog   = "";
var auxCat       = "";
var auxSub       = "";
var modelo       = "";
var grupoUser    = "";
var grupoAtend   = "";
var auxDestino   = "";
var auxUniOrig   = "";
var auxUnidade   = "";
var auxSetor     = "";
var auxOrigem    = "";
var auxOriGrp    = "";
var auxOriUni    = "";
var listaDes     = "";
var listaCat     = "";
var listaSub     = "";
var listaSetor   = "";
var lista        = "";
var proxResp     = "";
var gerenteAp    = "";
var nomeLider    = "";
var nomeUser     = "";
var nomeInic     = "";
var loginInic    = "";
var auxMembros   = "";
var auxLogin     = "";
var auxMembrosO  = "";
var auxLoginO    = "";
var auxUserDev   = "";
var auxDevolv    = "";
var auxAval      = "";
var auxData      = "";
var auxPriv      = "";
var auxAlc2      = "";
var auxAlc3      = "";
var responsaveis = "";
var atendentes   = "";
var respNomes    = "";
var atendNomes   = "";
var resp1  		 = "";
var resp2  		 = "";
var atend1 		 = "";
var atend2 		 = "";
var r1Nome 		 = "";
var r2Nome 		 = "";
var a1Nome 		 = "";
var a2Nome 		 = "";
var substituto   = "";
var auxCiclo     = 0;

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

			// Atualizar modelo
			modelo = atualizarModelo(response);

			// Atualizar grupo de origem e grupo de destino
			auxDestino = Form.fields("AUX_DESTINO").value();
			auxOriUni  = auxOrigem.toString().substring(0,2);
			auxSetor   = modelo.toString().substring(2,30);
			auxGrupo   = auxUnidade + auxSetor;
			auxOriGrp  = auxOriUni + auxSetor;

			Form.fields("AUX_GRUPO").value(auxGrupo);
			Form.fields("AUX_MODELO").value(modelo);
			Form.fields("AUX_ORIGEM").value(auxOriGrp);

			Form.fields("CATEGORIA").removeOptions([]);
			Form.fields("SUBCATEGORIA").removeOptions([]);

			Form.fields("AUX_ROTA").value("");			
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	
			Form.fields("CATEGORIA").value("");	
			Form.fields("SUBCATEGORIA").value("");				

			// Chamado aberto UAD
			if(auxUniOrig == "99"){ 

				auxOriGrp = chamadoUAD(auxOrigem);
				Form.fields("AUX_ORIGEM").value(auxOriGrp);
			
			}	

			// Atualizar grupos para carregar a lista de usuários
			atualizarGrupoOrigem(auxOrigem, auxOriGrp, auxUniOrig);
			atualizarGrupoDestino(auxDestino, auxGrupo, auxUnidade);
			
			console.log("Origem principal: "     + auxOrigem);
			console.log("Destino principal: "    + auxDestino);
			console.log("Grupo de origem: "      + auxOriGrp);
			console.log("Grupo de destino: "     + auxGrupo);
			console.log("Modelo de categorias: " + modelo);
			console.log("Unidade de origem: "    + auxUniOrig);
			console.log("Unidade de destino: "   + auxUnidade);		
			
			Form.apply();
		
		});	
		
		// Atualizar modelo para carregar a lista de categorias
		Form.fields("AUX_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			modelo = atualizarModelo(Form.fields("SETOR").value());
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
			
			Form.fields("AUX_ROTA").value("");			
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	

			auxCat = Form.fields("CATEGORIA").value();

			var piloto = "";

			if(auxUniOrig == "13" || auxUniOrig == "15" || auxUniOrig == "05"){
				piloto = "Sim";
			} else piloto = "Não";

			listaSubcategorias(modelo, auxCat, listaSub, piloto);

			Form.apply();

		});

		// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
		Form.fields("SUBCATEGORIA").subscribe("CLICK", function(itemId, data, response) {
			
			auxCat = Form.fields("CATEGORIA").value();

			var piloto = "";

			if(auxUniOrig == "13" || auxUniOrig == "15" || auxUniOrig == "05"){
				piloto = "Sim";
			} else piloto = "Não";

			listaSubcategorias(modelo, auxCat, listaSub, piloto);

		});		

		// Alteração de subcategoria, validar aprovação do gerente e resposnável por CRL produtos
		Form.fields("SUBCATEGORIA").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			Form.fields("AUX_ROTA").value("");
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");		

			auxCat    = Form.fields("CATEGORIA").value();
			auxSub    = Form.fields("SUBCATEGORIA").value();
			iniciador = Form.fields("AUX_INICIADOR").value();
			auxLider  = Form.fields("AUX_LIDER").value();

			// Carregar texto padrão
			textoPadrao(modelo, auxCat, auxSub);

			// Validar categorias aprovação gerente
			if(iniciador != auxLider){ 
				
				categoriaAprovaGerente(modelo, auxCat, auxSub); 

			}

			// Direcionar grupos crédito e rural
			if(auxUnidade == "99" && modelo == "99_credito"){

				if(auxCat == "Assinatura Eletrônica" && auxSub == "Solicitações em Geral"){ 
				
					novoGrupo = "99_credito_ass_eletronica";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}
				else
				if(auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
					
					novoGrupo = "99_cons_consig";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "CRL" && auxSub == "Alteração CRL Cartão"){ 
					
					novoGrupo = "99_credito_crl_cartao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "CRL" && (auxSub == "Pessoa Física" || auxSub == "Pessoa Jurídica" ||auxSub == "Pessoa Jurídica (Maior)") ||
				   auxCat == "Dúvidas" && auxSub == "Análise de Crédito" || auxCat == "Fábrica de Limites" && auxSub == "Solicitações em Geral"){ 
					
					novoGrupo = "99_credito_crl_geral";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "Contrapartes Conectadas (Grupo Econômico)" && auxSub == "Solicitações em Geral"){ 
					
					novoGrupo = "99_credito_grupo_economico";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "Liberação de Crédito" && (auxSub == "Cheque Especial / Conta Garantida" || auxSub == "Títulos Descontados" || auxSub == "Financiamento" || auxSub == "Giro Parcelado / Crédito Pessoal" ||
				   auxSub == "Giro Rotativo" || auxSub == "Consignado Privado" || auxSub == "Renegociação"|| auxSub == "Limite Cartão Acima de R$45.000,00")){ 
					
					novoGrupo = "99_credito_liberacao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "Liquidação" && (auxSub == "Amortização" || auxSub == "Quitação" || auxSub == "Financiamento")){ 
					
					novoGrupo = "99_credito_liquidacao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "Operações de Crédito" && (auxSub == "Cancelamento" || auxSub == "Garantias Reais" ||auxSub == "Solicitação de Boleto") ||
				   auxCat == "Dúvidas" && auxSub == "Controles" || auxCat == "Documentos Pendentes" && auxSub == "Solicitações em Geral"){ 
					
					novoGrupo = "99_credito_operacoes";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "Operações de Crédito" && auxSub == "Prorrogação"){ 
					
					novoGrupo = "99_credito_prorrogacao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else
				if(auxCat == "Liberação Talão de Cheque" && auxSub == "Solicitações em Geral"){ 
					
					novoGrupo = "99_credito_talao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}																									
				else{

					console.log("grupo padrão: " + auxGrupo);
					Form.fields("AUX_GRUPO").value(auxGrupo);
	
				}							

			}	
			else
			if(auxUnidade == "99" && modelo == "99_rural"){

				if(auxCat == "Crédito Rural" && auxSub == "Análise Técnica"){ 
				
					novoGrupo = "99_rural_analise_tecnica";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}
				else				
				if(auxCat == "Financiamento BNDES" && (auxSub == "Dúvidas" || auxSub == "Quitação" || auxSub == "Outros")){ 
				
					novoGrupo = "99_rural_bndes";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}
				else				
				if(auxCat == "Crédito Rural" && auxSub == "CRL" || auxCat == "Financiamento BNDES" && auxSub == "CRL"){ 
				
					novoGrupo = "99_rural_crl";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}		
				else				
				if(auxCat == "Crédito Rural" && auxSub == "Fiscalização"){ 
				
					novoGrupo = "99_rural_fiscalizacao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else				
				if(auxCat == "Crédito Rural" && (auxSub == "Dúvidas" || auxSub == "Outros")){ 
				
					novoGrupo = "99_rural_geral";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else				
				if(auxCat == "Crédito Rural" && auxSub == "Liberação de Crédito"){ 
				
					novoGrupo = "99_rural_liberacao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}													
				else{

					console.log("grupo padrão: " + auxGrupo);
					Form.fields("AUX_GRUPO").value(auxGrupo);
	
				}

			}
			else
			if(auxUnidade == "99" && modelo == "99_cadastro"){

				if(auxCat == "Conta Capital" && auxSub == "Campanha de Capitalização 2022"){ 
				
					novoGrupo = "99_cadastro_capitalizacao";
					Form.fields("AUX_GRUPO").value(novoGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(novoGrupo);
					console.log("novo grupo: " + novoGrupo);
				
				}	
				else{

					console.log("grupo padrão: " + auxGrupo);
					Form.fields("AUX_GRUPO").value(auxGrupo);
					Form.fields("AUX_GRUPO_DESTINO").value(auxGrupo);
	
				}							

			}
			else{

				console.log("grupo padrão: " + auxGrupo);
				Form.fields("AUX_GRUPO").value(auxGrupo);

			}

			Form.apply();

		});	

		// Mostrar campos de pesquisa de cliente
		Form.fields("SUBCATEGORIA").subscribe("CHANGE", function(itemId, data, response) {		
			
			if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"         || modelo == "99_cartoes"     ||
			   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao"   || modelo == "99_cons_consig" || 
			   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"        || modelo == "99_rural"       || 
			   modelo == "99_seguros"     || modelo == "99_conectividade"  || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

				Form.fields('CPF_CNPJ').visible(true);
				Form.fields('NOME_RAZAO').visible(true);
				Form.fields('PESSOA_CONTA').visible(true);
				
				if(modelo == "99_cadastro"){

					Form.fields('CPF_CNPJ').setRequired('aprovar', true);
					Form.fields('NOME_RAZAO').setRequired('aprovar', true);

				}
				else{

					Form.fields('CPF_CNPJ').setRequired('aprovar', false);
					Form.fields('NOME_RAZAO').setRequired('aprovar', false);

				}
					
			}
			else{

				Form.fields('CPF_CNPJ').visible(false);
				Form.fields('NOME_RAZAO').visible(false);
				Form.fields('PESSOA_CONTA').visible(false);

				Form.fields('CPF_CNPJ').setRequired('aprovar', false);
				Form.fields('NOME_RAZAO').setRequired('aprovar', false);

			}

			Form.apply();

		});			
		
		// Campo chamado privado, se alterado reiniciar rota e grupo de iniciadores
		Form.fields("PRIVADO").subscribe("CHANGE", function(itemId, data, response) {
			
			Form.fields("AUX_ROTA").value("");
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	

			// Não permitir incluir responsáveis adicionais para chamado privado
			if(response == "Sim"){

				Form.fields("ADD_RESPONSAVEL1").value("");	
				Form.fields("ADD_RESPONSAVEL2").value("");
				Form.fields("ADD_RESPONSAVEL1").disabled(true);
				Form.fields("ADD_RESPONSAVEL2").disabled(true);

			}
			else{

				Form.fields("ADD_RESPONSAVEL1").disabled(false);
				Form.fields("ADD_RESPONSAVEL2").disabled(false);

			}
	
			Form.apply();
		
		});		

		// Atualizar nome e hora na grid
		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("NOME_USER_ATUAL").value();

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
			auxRota     = Form.fields("AUX_ROTA").value();
			nomeLider   = Form.fields("AUX_NOME_LIDER").value();
			auxCiclo    = Form.fields("AUX_CICLO").value();
			gerenteAp   = Form.fields("AUX_APROV_LIDER").value();
			auxUserDev  = Form.fields("AUX_USER_DEV").value();
			auxDevolv   = Form.fields("AUX_DEVOLUCAO").value();
			auxPriv     = Form.fields("PRIVADO").value();
			auxInicLog  = Form.fields("AUX_INICIADOR").value();
			auxInicNom  = Form.fields("INICIADOR").value();
			auxMembros  = Form.fields("AUX_SQL_GRUPO").value();
			auxLogin    = Form.fields("AUX_SQL_GRUPO_LOGIN").value();
			auxMembrosO = Form.fields("AUX_GRUPO_ORIGEM_NOMES").value();
			auxLoginO   = Form.fields("AUX_GRUPO_ORIGEM_LOGIN").value();
			auxAlc2     = Form.fields("AUX_SQL_ALC2").value();
			auxAlc3     = Form.fields("AUX_SQL_ALC3").value();

			// Atualizar responsáveis e atendentes somente no registro do chamado
			if(auxCiclo == 1 && auxRota == "Registrar Chamado"){

				resp1  = Form.fields("ADD_RESPONSAVEL1").value();
				resp2  = Form.fields("ADD_RESPONSAVEL2").value();
				atend1 = Form.fields("ADD_ATENDENTE1").value();
				atend2 = Form.fields("ADD_ATENDENTE2").value();
				r1Nome = Form.fields("ADD_RESPONSAVEL1").rawValue();
				r2Nome = Form.fields("ADD_RESPONSAVEL2").rawValue();
				a1Nome = Form.fields("ADD_ATENDENTE1").rawValue();
				a2Nome = Form.fields("ADD_ATENDENTE2").rawValue();

				// Validação de responsáveis
				if(auxPriv == "Sim"){

					respNomes = auxInicNom;
					responsaveis = auxInicLog;
					Form.fields("RESPONSAVEIS").value(responsaveis);
					Form.fields("RESPONSAVEIS_NOMES").value(respNomes);
					console.log("Chamado privado");
					console.log(responsaveis);				

				}
				else{
					if(r1Nome != "" && r2Nome == ""){

						respNomes = auxInicNom + ", " + r1Nome;
						responsaveis = auxInicLog + ", " + resp1;
						Form.fields("RESPONSAVEIS").value(responsaveis).apply();
						Form.fields("RESPONSAVEIS_NOMES").value(respNomes).apply();
						console.log("Responsável Adicional 1 definido");
						console.log(responsaveis);

					}
					else 
					if(r1Nome == "" && r2Nome != ""){

						respNomes = auxInicNom + ", " + r2Nome;
						responsaveis = auxInicLog + ", " + resp2;
						Form.fields("RESPONSAVEIS").value(responsaveis).apply();
						Form.fields("RESPONSAVEIS_NOMES").value(respNomes).apply();
						console.log("Responsável Adicional 2 definido");
						console.log(responsaveis);

					}	
					else 
					if(r1Nome != "" && r2Nome != ""){

						respNomes = auxInicNom + ", " + r1Nome + ", " + r2Nome;
						responsaveis = auxInicLog + ", " + resp1 + ", " + resp2;
						Form.fields("RESPONSAVEIS").value(responsaveis).apply();
						Form.fields("RESPONSAVEIS_NOMES").value(respNomes).apply();
						console.log("Dois responsáveis adicionais definidos");
						console.log(responsaveis);

					}
					else{ 

						if(auxLoginO.toString().indexOf(auxInicLog) == -1){

							respNomes = auxInicNom + ", " + auxMembrosO;
							responsaveis = auxInicLog + ", " + auxLoginO; 
							Form.fields("RESPONSAVEIS").value(responsaveis).apply();
							Form.fields("RESPONSAVEIS_NOMES").value(respNomes).apply();
							console.log("Nenhum responsável adicional definido, iniciador não está no grupo.");
							console.log(responsaveis);

						}
						else{

							respNomes = auxMembrosO;
							responsaveis = auxLoginO; 
							Form.fields("RESPONSAVEIS").value(responsaveis).apply();
							Form.fields("RESPONSAVEIS_NOMES").value(respNomes).apply();
							console.log("Nenhum responsável adicional definido, iniciador está no grupo");
							console.log(responsaveis);

						}
					
					}
				}
				
				// Validação de atendentes
				if(a1Nome != "" && a2Nome == ""){

					atendNomes = a1Nome;
					atendentes = atend1;
					Form.fields("ATENDENTES").value(atendentes);
					Form.fields("ATENDENTES_NOMES").value(atendNomes);
					console.log("Atendente 1 definido");
					console.log(atendentes);

				}
				else 
				if(a1Nome == "" && a2Nome != ""){

					atendNomes = a2Nome;
					atendentes = atend2;
					Form.fields("ATENDENTES").value(atendentes);
					Form.fields("ATENDENTES_NOMES").value(atendNomes);
					console.log("Atendente 2 definido");
					console.log(atendentes);

				}	
				else 
				if(a1Nome != "" && a2Nome != ""){

					atendNomes = a1Nome + ", " + a2Nome;
					atendentes = atend1 + ", " + atend2;
					Form.fields("ATENDENTES").value(atendentes);
					Form.fields("ATENDENTES_NOMES").value(atendNomes);
					console.log("Dois atendentes definidos");
					console.log(atendentes);

				}
				else{ 
					
					atendNomes = auxMembros;
					atendentes = auxLogin; 
					Form.fields("ATENDENTES").value(atendentes);
					Form.fields("ATENDENTES_NOMES").value(atendNomes);
					console.log("Nenhum atendente definido");
					console.log(atendentes);
				
				}	

			}

			// Chamado já aprovado, ou aberto em categoria que não precisa de aprovação do gerente
			if(auxRota == "Registrar Chamado"){

				// Chamado novo
				if(auxCiclo == 1){ 

					if(gerenteAp == "Não"){
						Form.fields("PROX_ETAPA").value("Assumir Novo Chamado");
						Form.fields("PROX_RESP").value(atendNomes);
					}
					else
					if(gerenteAp == "Sim"){
						Form.fields("PROX_ETAPA").value("Aprovar Solicitação de Atendimento");
						Form.fields("PROX_RESP").value(nomeLider);
					}	

					Form.actions('aprovar').disabled(false);
					Form.actions('cancel').disabled(true);

				}
				
				// Chamado devolvido
				if(auxCiclo > 1){ 

					responsaveis = Form.fields("RESPONSAVEIS").value();
					atendentes   = Form.fields("ATENDENTES").value();
					respNomes    = Form.fields("RESPONSAVEIS_NOMES").value();
					atendNomes   = Form.fields("ATENDENTES_NOMES").value();

					// Limpar usuário de atendimento
					Form.fields("AUX_NOME_SER").value("");

					if(auxDevolv == "Devolvido Alçada 1"){
						Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
						Form.fields("PROX_RESP").value(atendNomes);
					}
					else
					if(auxDevolv == "Devolvido Alçada 2"){
						Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 2");
						Form.fields("PROX_RESP").value(auxAlc2);
					}
					else	
					if(auxDevolv == "Devolvido Alçada 3"){
						Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 3");
						Form.fields("PROX_RESP").value(auxAlc3);
					}									

					Form.actions('aprovar').disabled(false);
					Form.actions('rejeitar').disabled(true);

				}

			}		

			// Chamado cancelado pelo usuário
			if(auxRota == "Cancelar Chamado"){

				Form.fields("PROX_ETAPA").value("Arquivar Chamado");
				Form.fields("PROX_RESP").value(auxInicNom);

				// Bloquear ações do form
				if(auxCiclo == 1){
					Form.actions('aprovar').disabled(true);
					Form.actions('cancel').disabled(false);
				}
				else 
				if(auxCiclo > 1){
					Form.actions('aprovar').disabled(true);
					Form.actions('rejeitar').disabled(false);
				}

			}

			Form.apply();

		});			

		// Resultado select usuários origem
		Form.fields("AUX_LISTA_USUARIOS").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("Usuários origem: " + response);

			var listaUsersOrig = response.split(";");
			var newObj = [];

			listaUsersOrig.forEach(function (dados) {

				// Separar resultado do select, uma coluna para cada @
				var nome  = dados.split("@")[0];
				var login = dados.split("@")[1];

				// Objeto com os parâmetros de nome e login
				var newOption = {name: nome, value: login};

				// Usar o método push para adicionar o objeto no array
				newObj.push(newOption);

			});

			var addResp1 = Form.fields("ADD_RESPONSAVEL1");
			var addResp2 = Form.fields("ADD_RESPONSAVEL2");

			// Carregar o array de objetos nas listas
			addResp1.addOptions(newObj).apply();
			addResp2.addOptions(newObj).apply();

		});	

		// Resultado select usuários destino
		Form.fields("AUX_LISTA_SETORES").subscribe("SET_FIELD_VALUE", function (itemId, data, response) {

			console.log("Usuários destino: " + response);

			var listaUserDest  = response.split(";");
			var newObj = [];

			listaUserDest.forEach(function (dados) {

				// Separar resultado do select, uma coluna para cada @
				var nome  = dados.split("@")[0];
				var login = dados.split("@")[1];

				// Objeto com os parâmetros de nome e login
				var newOption = {name: nome, value: login};

				// Usar o método push para adicionar o objeto no array
				newObj.push(newOption);

			});

			var addResp1 = Form.fields("ADD_ATENDENTE1");
			var addResp2 = Form.fields("ADD_ATENDENTE2");			

			// Carregar o array de objetos nas listas
			addResp1.addOptions(newObj).apply();
			addResp2.addOptions(newObj).apply();			

		});	
		
		// Lista Responsáveis 1
		Form.fields("ADD_RESPONSAVEL1").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("");			
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	
			
			// Carregar valores iniciais
			var valor = Form.fields("ADD_RESPONSAVEL1").rawValue();
			var get = Form.fields("ADD_RESPONSAVEL1").get();

			// Listar todas as propriedades do objeto
			const props = Object.keys(get);

			console.log(props);
			console.log(get);
			console.log(valor);

			Form.apply();
		
		});	
		
		// Lista Responsáveis 2
		Form.fields("ADD_RESPONSAVEL2").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("");			
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	
			
			// Carregar valores iniciais
			var valor = Form.fields("ADD_RESPONSAVEL2").rawValue();
			var get = Form.fields("ADD_RESPONSAVEL2").get();

			// Listar todas as propriedades do objeto
			const props = Object.keys(get);

			console.log(props);
			console.log(get);
			console.log(valor);

			Form.apply();
		
		});		

		// Lista Atendentes 1
		Form.fields("ADD_ATENDENTE1").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("");			
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	
			
			// Carregar valores iniciais
			var valor = Form.fields("ADD_ATENDENTE1").rawValue();
			var get = Form.fields("ADD_ATENDENTE1").get();

			// Listar todas as propriedades do objeto
			const props = Object.keys(get);

			console.log(props);
			console.log(get);
			console.log(valor);
			console.log(get.options.length);

			Form.apply();
		
		});	
		
		// Lista Atendentes 2
		Form.fields("ADD_ATENDENTE2").subscribe("CHANGE", function(itemId, data, response) {

			Form.fields("AUX_ROTA").value("");			
			Form.fields("PROX_ETAPA").value("");
			Form.fields("PROX_RESP").value("");	
			
			// Carregar valores iniciais
			var valor = Form.fields("ADD_ATENDENTE2").rawValue();
			var get = Form.fields("ADD_ATENDENTE2").get();

			// Listar todas as propriedades do objeto
			const props = Object.keys(get);

			console.log(props);
			console.log(get);
			console.log(valor);
			console.log(get.options.length);

			Form.apply();
		
		});				

	}

	if(codigoEtapa == APROVAR_GERENTE){

		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota      = Form.fields("AUX_ROTA").value();
			atendentes   = Form.fields("ATENDENTES").value();
			atendNomes   = Form.fields("ATENDENTES_NOMES").value();
			nomeLider    = Form.fields("AUX_NOME_LIDER").value();
			
			if(auxRota == "Aprovar Solicitação"){

				Form.fields("PROX_ETAPA").value("Assumir Novo Chamado");
				Form.fields("PROX_RESP").value(atendNomes);
				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}		
			
			if(auxRota == "Rejeitar e Cancelar"){			

				Form.fields("PROX_ETAPA").value("Arquivar Chamado");
				Form.fields("PROX_RESP").value(nomeLider);
				Form.actions('aprovar').disabled(true);
				Form.actions('rejeitar').disabled(false);

			}				

			Form.apply();

		});		

	}	

	if(codigoEtapa == REALIZAR_ATENDIMENTO){
		
		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota      = Form.fields("AUX_ROTA").value();
			auxGrupo     = Form.fields("DESTINO").value();
			nomeInic     = Form.fields("INICIADOR").value();
			loginInic    = Form.fields("AUX_INICIADOR").value();
			nomeUser     = Form.fields("AUX_NOME_SER").value();
			modelo       = Form.fields("AUX_MODELO").value();
			responsaveis = Form.fields("RESPONSAVEIS").value();
			atendentes   = Form.fields("ATENDENTES").value();
			respNomes    = Form.fields("RESPONSAVEIS_NOMES").value();
			atendNomes   = Form.fields("ATENDENTES_NOMES").value();
			grupoAtend   = Form.fields("AUX_GRUPO").value();

			Form.fields('DOC_INVALIDO').visible(false);
			Form.fields('DOC_NAO_ENVIADO').visible(false);
			Form.fields('DOC_INSUFICIENTE').visible(false);
			Form.fields('FALTA_INFORMACOES').visible(false);
			Form.fields('INFO_SISBR').visible(false);
			Form.fields('AUTORIZACAO').visible(false);					
			Form.fields('APROVACAO').visible(false);				
			Form.fields('PEDIDO_PA').visible(false);				
			
			if(auxRota == "Finalizar Atendimento"){

				console.log("responsáveis: " + responsaveis);
				console.log("atendentes: " + atendentes);

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento");
				Form.fields("PROX_RESP").value(respNomes);
				Form.fields("AUX_USER_DEV").value("Aprovado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota == "Devolver ao Solicitante"){	
				
				if(grupoAtend == "99_cadastro"){

					Form.fields('DOC_INVALIDO').visible(true);
					Form.fields('DOC_NAO_ENVIADO').visible(true);
					Form.fields('DOC_INSUFICIENTE').visible(true);
					Form.fields('FALTA_INFORMACOES').visible(true);
					Form.fields('INFO_SISBR').visible(true);
					Form.fields('AUTORIZACAO').visible(true);					
					Form.fields('APROVACAO').visible(true);		
					Form.fields('PEDIDO_PA').visible(true);			

				}				

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 1");
				Form.fields("AUX_USER_DEV").value("Devolvido").apply();
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento");
				Form.fields("PROX_RESP").value(respNomes);

				Form.actions('aprovar').disabled(true);
				Form.actions('rejeitar').disabled(false);

			}
			if(auxRota == "Aguardando Terceiros"){

				if(grupoAtend == "99_cadastro"){

					Form.fields('DOC_INVALIDO').visible(true);
					Form.fields('DOC_NAO_ENVIADO').visible(true);
					Form.fields('DOC_INSUFICIENTE').visible(true);
					Form.fields('FALTA_INFORMACOES').visible(true);
					Form.fields('INFO_SISBR').visible(true);
					Form.fields('AUTORIZACAO').visible(true);					
					Form.fields('APROVACAO').visible(true);		
					Form.fields('PEDIDO_PA').visible(true);				

				}

				Form.fields("PROX_ETAPA").value("Aguardando Terceiros");
				Form.fields("PROX_RESP").value(atendNomes);
				Form.fields("AUX_USER_DEV").value("Aguardando");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}	
			if(auxRota == "Submeter Alçada Nível 2"){

				alcadaNivel2(modelo, auxRota);
				Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 2");
				Form.fields("AUX_USER_DEV").value("Submetido");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota == "Encaminhar Chamado"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("");
				Form.fields("PROX_RESP").value("")	
				Form.fields("AUX_NOME_SER").value("");	

				// Definir campos que vão receber as listas de opções
				listaCat = Form.fields("CATEGORIA_NOVO");
				listaSub = Form.fields("SUBCATEGORIA_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true);
				Form.fields('CATEGORIA_NOVO').visible(true);
				Form.fields('SUBCATEGORIA_NOVO').visible(true);
				Form.fields('SETOR_NOVO').visible(true);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SETOR_NOVO').setRequired('aprovar', true);

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
					modelo    = atualizarModelo(Form.fields("SETOR_NOVO").value());
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
					
					modelo = atualizarModelo(Form.fields("SETOR_NOVO").value());
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

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";					

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					// Direcionar grupos crédito e rural
					if(auxUnidade == "99" && modelo == "99_credito"){

						if(auxCat == "Assinatura Eletrônica" && auxSub == "Solicitações em Geral"){ 
						
							novoGrupo = "99_credito_ass_eletronica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else
						if(auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
							
							novoGrupo = "99_cons_consig";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && auxSub == "Alteração CRL Cartão"){ 
							
							novoGrupo = "99_credito_crl_cartao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && (auxSub == "Pessoa Física" || auxSub == "Pessoa Jurídica" ||auxSub == "Pessoa Jurídica (Maior)") ||
						auxCat == "Dúvidas" && auxSub == "Análise de Crédito" || auxCat == "Fábrica de Limites" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_crl_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Contrapartes Conectadas (Grupo Econômico)" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_grupo_economico";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação de Crédito" && (auxSub == "Cheque Especial / Conta Garantida" || auxSub == "Títulos Descontados" || auxSub == "Financiamento" || auxSub == "Giro Parcelado / Crédito Pessoal" ||
						auxSub == "Giro Rotativo" || auxSub == "Consignado Privado" || auxSub == "Renegociação"|| auxSub == "Limite Cartão Acima de R$45.000,00")){ 
							
							novoGrupo = "99_credito_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liquidação" && (auxSub == "Amortização" || auxSub == "Quitação" || auxSub == "Financiamento")){ 
							
							novoGrupo = "99_credito_liquidacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && (auxSub == "Cancelamento" || auxSub == "Garantias Reais" ||auxSub == "Solicitação de Boleto") ||
						auxCat == "Dúvidas" && auxSub == "Controles" || auxCat == "Documentos Pendentes" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_operacoes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && auxSub == "Prorrogação"){ 
							
							novoGrupo = "99_credito_prorrogacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação Talão de Cheque" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_talao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}																									
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							

					}	
					else
					if(auxUnidade == "99" && modelo == "99_rural"){

						if(auxCat == "Crédito Rural" && auxSub == "Análise Técnica"){ 
						
							novoGrupo = "99_rural_analise_tecnica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Financiamento BNDES" && (auxSub == "Dúvidas" || auxSub == "Quitação" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_bndes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Crédito Rural" && auxSub == "CRL" || auxCat == "Financiamento BNDES" && auxSub == "CRL"){ 
						
							novoGrupo = "99_rural_crl";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}		
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Fiscalização"){ 
						
							novoGrupo = "99_rural_fiscalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && (auxSub == "Dúvidas" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Liberação de Crédito"){ 
						
							novoGrupo = "99_rural_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}													
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}

					}
					else
					if(auxUnidade == "99" && modelo == "99_cadastro"){
		
						if(auxCat == "Conta Capital" && auxSub == "Campanha de Capitalização 2022"){ 
						
							novoGrupo = "99_cadastro_capitalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}		
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}						
														
					}					
					else{

						console.log("grupo padrão: " + auxGrupo);
						Form.fields("AUX_GRUPO").value(auxGrupo);

					}	

					Form.apply();
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
				Form.fields("AUX_USER_DEV").value("Encaminhado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota != "Encaminhar Chamado"){

				Form.fields('DESTINO_NOVO').visible(false);
				Form.fields('CATEGORIA_NOVO').visible(false);
				Form.fields('SUBCATEGORIA_NOVO').visible(false);
				Form.fields('SETOR_NOVO').visible(false);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SETOR_NOVO').setRequired('aprovar', false);

			}	
			
			Form.apply();

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

		// Execução de SQL com a função de aprovadores nível 2
		Form.fields("AUX_SQL_ALC2").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Submeter Alçada Nível 2")
				Form.fields("PROX_RESP").value(response).apply();

		});	
		
		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response);
			Form.fields("ATENDENTES_NOMES").value(response);

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true);

			Form.apply();
		
		});	
		
		// Execução de SQL com a lista de login do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO_LOGIN").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("ATENDENTES").value(response).apply();
		
		});			

	}		

	if(codigoEtapa == AGUARDANDO_TERCEIROS){
		
		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {

			auxRota      = Form.fields("AUX_ROTA").value();
			auxGrupo     = Form.fields("DESTINO").value();
			nomeInic     = Form.fields("INICIADOR").value();
			loginInic    = Form.fields("AUX_INICIADOR").value();
			nomeUser     = Form.fields("AUX_NOME_SER").value();
			modelo       = Form.fields("AUX_MODELO").value();
			responsaveis = Form.fields("RESPONSAVEIS").value();
			atendentes   = Form.fields("ATENDENTES").value();
			respNomes    = Form.fields("RESPONSAVEIS_NOMES").value();
			atendNomes   = Form.fields("ATENDENTES_NOMES").value();		

			Form.fields('DOC_INVALIDO').visible(false);
			Form.fields('DOC_NAO_ENVIADO').visible(false);
			Form.fields('DOC_INSUFICIENTE').visible(false);
			Form.fields('FALTA_INFORMACOES').visible(false);
			Form.fields('INFO_SISBR').visible(false);
			Form.fields('AUTORIZACAO').visible(false);					
			Form.fields('APROVACAO').visible(false);	
			Form.fields('PEDIDO_PA').visible(false);		
			
			if(auxRota == "Finalizar Atendimento" ){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento");
				Form.fields("PROX_RESP").value(respNomes);
				Form.fields("AUX_USER_DEV").value("Aprovado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota == "Devolver ao Solicitante"){

				// Chamados cadastro aguardando terceiros
				if(modelo == "99_cadastro"){

					Form.fields('DOC_INVALIDO').visible(true);
					Form.fields('DOC_NAO_ENVIADO').visible(true);
					Form.fields('DOC_INSUFICIENTE').visible(true);
					Form.fields('FALTA_INFORMACOES').visible(true);
					Form.fields('INFO_SISBR').visible(true);
					Form.fields('AUTORIZACAO').visible(true);					
					Form.fields('APROVACAO').visible(true);	
					Form.fields('PEDIDO_PA').visible(true);	

				}				

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 1");
				Form.fields("AUX_USER_DEV").value("Devolvido");
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento");
				Form.fields("PROX_RESP").value(respNomes);

				Form.actions('aprovar').disabled(true);
				Form.actions('rejeitar').disabled(false);

			}
			if(auxRota == "Encaminhar Chamado"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("");
				Form.fields("PROX_RESP").value("");	
				Form.fields("AUX_NOME_SER").value("");

				// Definir campos que vão receber as listas de opções
				listaCat = Form.fields("CATEGORIA_NOVO");
				listaSub = Form.fields("SUBCATEGORIA_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true);
				Form.fields('CATEGORIA_NOVO').visible(true);
				Form.fields('SUBCATEGORIA_NOVO').visible(true);
				Form.fields('SETOR_NOVO').visible(true);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SETOR_NOVO').setRequired('aprovar', true);

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
					modelo    = atualizarModelo(Form.fields("SETOR_NOVO").value());
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
					
					modelo = atualizarModelo(Form.fields("SETOR_NOVO").value());
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

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					// Direcionar grupos crédito e rural
					if(auxUnidade == "99" && modelo == "99_credito"){

						if(auxCat == "Assinatura Eletrônica" && auxSub == "Solicitações em Geral"){ 
						
							novoGrupo = "99_credito_ass_eletronica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else
						if(auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
							
							novoGrupo = "99_cons_consig";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && auxSub == "Alteração CRL Cartão"){ 
							
							novoGrupo = "99_credito_crl_cartao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && (auxSub == "Pessoa Física" || auxSub == "Pessoa Jurídica" ||auxSub == "Pessoa Jurídica (Maior)") ||
						auxCat == "Dúvidas" && auxSub == "Análise de Crédito" || auxCat == "Fábrica de Limites" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_crl_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Contrapartes Conectadas (Grupo Econômico)" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_grupo_economico";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação de Crédito" && (auxSub == "Cheque Especial / Conta Garantida" || auxSub == "Títulos Descontados" || auxSub == "Financiamento" || auxSub == "Giro Parcelado / Crédito Pessoal" ||
						auxSub == "Giro Rotativo" || auxSub == "Consignado Privado" || auxSub == "Renegociação"|| auxSub == "Limite Cartão Acima de R$45.000,00")){ 
							
							novoGrupo = "99_credito_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liquidação" && (auxSub == "Amortização" || auxSub == "Quitação" || auxSub == "Financiamento")){ 
							
							novoGrupo = "99_credito_liquidacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && (auxSub == "Cancelamento" || auxSub == "Garantias Reais" ||auxSub == "Solicitação de Boleto") ||
						auxCat == "Dúvidas" && auxSub == "Controles" || auxCat == "Documentos Pendentes" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_operacoes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && auxSub == "Prorrogação"){ 
							
							novoGrupo = "99_credito_prorrogacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação Talão de Cheque" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_talao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}																									
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							

					}	
					else
					if(auxUnidade == "99" && modelo == "99_rural"){

						if(auxCat == "Crédito Rural" && auxSub == "Análise Técnica"){ 
						
							novoGrupo = "99_rural_analise_tecnica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Financiamento BNDES" && (auxSub == "Dúvidas" || auxSub == "Quitação" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_bndes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Crédito Rural" && auxSub == "CRL" || auxCat == "Financiamento BNDES" && auxSub == "CRL"){ 
						
							novoGrupo = "99_rural_crl";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}		
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Fiscalização"){ 
						
							novoGrupo = "99_rural_fiscalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && (auxSub == "Dúvidas" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Liberação de Crédito"){ 
						
							novoGrupo = "99_rural_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}													
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}

					}
					else
					if(auxUnidade == "99" && modelo == "99_cadastro"){
		
						if(auxCat == "Conta Capital" && auxSub == "Campanha de Capitalização 2022"){ 
						
							novoGrupo = "99_cadastro_capitalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else{
		
							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							
		
					}					
					else{

						console.log("grupo padrão: " + auxGrupo);
						Form.fields("AUX_GRUPO").value(auxGrupo);

					}	

					Form.apply();
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
				Form.fields("AUX_USER_DEV").value("Encaminhado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota != "Encaminhar Chamado"){

				Form.fields('DESTINO_NOVO').visible(false);
				Form.fields('CATEGORIA_NOVO').visible(false);
				Form.fields('SUBCATEGORIA_NOVO').visible(false);
				Form.fields('SETOR_NOVO').visible(false);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SETOR_NOVO').setRequired('aprovar', false);

			}	
			
			Form.apply();

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

		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response);
			Form.fields("ATENDENTES_NOMES").value(response);

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true);

			Form.apply();
		
		});	
		
		// Execução de SQL com a lista de login do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO_LOGIN").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("ATENDENTES").value(response).apply();
		
		});			

	}	

	if(codigoEtapa == APROVACAO_ALCADA_2){

		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota      = Form.fields("AUX_ROTA").value();
			auxGrupo     = Form.fields("DESTINO").value();
			nomeInic     = Form.fields("INICIADOR").value();
			loginInic    = Form.fields("AUX_INICIADOR").value();
			nomeUser     = Form.fields("AUX_NOME_SER").value();
			modelo       = Form.fields("AUX_MODELO").value();
			responsaveis = Form.fields("RESPONSAVEIS").value();
			atendentes   = Form.fields("ATENDENTES").value();
			respNomes    = Form.fields("RESPONSAVEIS_NOMES").value();
			atendNomes   = Form.fields("ATENDENTES_NOMES").value();
			
			if(auxRota == "Encerrar Chamado" ){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento");
				Form.fields("PROX_RESP").value(respNomes);
				Form.fields("AUX_USER_DEV").value("Rejeitado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota == "Devolver ao Solicitante"){

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 2");
				Form.fields("AUX_USER_DEV").value("Devolvido");
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento");
				Form.fields("PROX_RESP").value(respNomes);

				Form.actions('aprovar').disabled(true);
				Form.actions('rejeitar').disabled(false);

			}
			if(auxRota == "Aprovar e Prosseguir"){

				Form.fields("AUX_NOME_SER").value("");
				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
				Form.fields("AUX_USER_DEV").value("Aprovado");
				Form.fields("PROX_RESP").value(atendNomes);

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}			
			if(auxRota == "Submeter Alçada Nível 3"){

				alcadaNivel3(modelo, auxRota);
				Form.fields("PROX_ETAPA").value("Aprovar Solicitação Alçada Nível 3");
				Form.fields("AUX_USER_DEV").value("Submetido");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}			
			if(auxRota == "Aprovar e Encaminhar"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("");
				Form.fields("PROX_RESP").value("")	
				Form.fields("AUX_NOME_SER").value("");

				// Definir campos que vão receber as listas de opções
				listaCat   = Form.fields("CATEGORIA_NOVO");
				listaSub   = Form.fields("SUBCATEGORIA_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true);
				Form.fields('CATEGORIA_NOVO').visible(true);
				Form.fields('SUBCATEGORIA_NOVO').visible(true);
				Form.fields('SETOR_NOVO').visible(true);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SETOR_NOVO').setRequired('aprovar', true);

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
					modelo    = atualizarModelo(Form.fields("SETOR_NOVO").value());
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
					
					modelo = atualizarModelo(Form.fields("SETOR_NOVO").value());
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

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					if(auxUnidade == "99" && modelo == "99_credito"){

						if(auxCat == "Assinatura Eletrônica" && auxSub == "Solicitações em Geral"){ 
						
							novoGrupo = "99_credito_ass_eletronica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else
						if(auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
							
							novoGrupo = "99_cons_consig";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && auxSub == "Alteração CRL Cartão"){ 
							
							novoGrupo = "99_credito_crl_cartao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && (auxSub == "Pessoa Física" || auxSub == "Pessoa Jurídica" ||auxSub == "Pessoa Jurídica (Maior)") ||
						auxCat == "Dúvidas" && auxSub == "Análise de Crédito" || auxCat == "Fábrica de Limites" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_crl_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Contrapartes Conectadas (Grupo Econômico)" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_grupo_economico";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação de Crédito" && (auxSub == "Cheque Especial / Conta Garantida" || auxSub == "Títulos Descontados" || auxSub == "Financiamento" || auxSub == "Giro Parcelado / Crédito Pessoal" ||
						auxSub == "Giro Rotativo" || auxSub == "Consignado Privado" || auxSub == "Renegociação"|| auxSub == "Limite Cartão Acima de R$45.000,00")){ 
							
							novoGrupo = "99_credito_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liquidação" && (auxSub == "Amortização" || auxSub == "Quitação" || auxSub == "Financiamento")){ 
							
							novoGrupo = "99_credito_liquidacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && (auxSub == "Cancelamento" || auxSub == "Garantias Reais" ||auxSub == "Solicitação de Boleto") ||
						auxCat == "Dúvidas" && auxSub == "Controles" || auxCat == "Documentos Pendentes" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_operacoes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && auxSub == "Prorrogação"){ 
							
							novoGrupo = "99_credito_prorrogacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação Talão de Cheque" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_talao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}																									
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							

					}	
					else
					if(auxUnidade == "99" && modelo == "99_rural"){

						if(auxCat == "Crédito Rural" && auxSub == "Análise Técnica"){ 
						
							novoGrupo = "99_rural_analise_tecnica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Financiamento BNDES" && (auxSub == "Dúvidas" || auxSub == "Quitação" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_bndes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Crédito Rural" && auxSub == "CRL" || auxCat == "Financiamento BNDES" && auxSub == "CRL"){ 
						
							novoGrupo = "99_rural_crl";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}		
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Fiscalização"){ 
						
							novoGrupo = "99_rural_fiscalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && (auxSub == "Dúvidas" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Liberação de Crédito"){ 
						
							novoGrupo = "99_rural_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}													
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}

					}
					else
					if(auxUnidade == "99" && modelo == "99_cadastro"){
		
						if(auxCat == "Conta Capital" && auxSub == "Campanha de Capitalização 2022"){ 
						
							novoGrupo = "99_cadastro_capitalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else{
		
							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							
		
					}					
					else{

						console.log("grupo padrão: " + auxGrupo);
						Form.fields("AUX_GRUPO").value(auxGrupo);

					}	

					Fomr.apply();
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
				Form.fields("AUX_USER_DEV").value("Encaminhado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota != "Aprovar e Encaminhar"){

				Form.fields('DESTINO_NOVO').visible(false);
				Form.fields('CATEGORIA_NOVO').visible(false);
				Form.fields('SUBCATEGORIA_NOVO').visible(false);
				Form.fields('SETOR_NOVO').visible(false);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SETOR_NOVO').setRequired('aprovar', false);

			}	
			
			Form.apply();

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

		// Execução de SQL com a função de aprovadores nível 3
		Form.fields("AUX_SQL_ALC3").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			if(auxRota == "Submeter Alçada Nível 3")
				Form.fields("PROX_RESP").value(response).apply();

		});	
		
		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response);
			Form.fields("ATENDENTES_NOMES").value(response);

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true);
			
			Form.apply();
		
		});	
		
		// Execução de SQL com a lista de login do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO_LOGIN").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("ATENDENTES").value(response).apply();
		
		});				

	}	

	if(codigoEtapa == APROVACAO_ALCADA_3){

		// Atualizar nível de atendimento alçadas
		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota      = Form.fields("AUX_ROTA").value();
			auxGrupo     = Form.fields("DESTINO").value();
			nomeInic     = Form.fields("INICIADOR").value();
			loginInic    = Form.fields("AUX_INICIADOR").value();
			nomeUser     = Form.fields("AUX_NOME_SER").value();
			modelo       = Form.fields("AUX_MODELO").value();
			responsaveis = Form.fields("RESPONSAVEIS").value();
			atendentes   = Form.fields("ATENDENTES").value();
			respNomes    = Form.fields("RESPONSAVEIS_NOMES").value();
			atendNomes   = Form.fields("ATENDENTES_NOMES").value();
			
			if(auxRota == "Encerrar Chamado" ){

				Form.fields("PROX_ETAPA").value("Avaliar Atendimento");
				Form.fields("PROX_RESP").value(respNomes);
				Form.fields("AUX_USER_DEV").value("Rejeitado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota == "Devolver ao Solicitante"){

				Form.fields("AUX_DEVOLUCAO").value("Devolvido Alçada 3");
				Form.fields("AUX_USER_DEV").value("Devolvido");
				Form.fields("PROX_ETAPA").value("Registrar Solciitação de Atendimento");
				Form.fields("PROX_RESP").value(respNomes);

				Form.actions('aprovar').disabled(true);
				Form.actions('rejeitar').disabled(false);

			}
			if(auxRota == "Aprovar e Prosseguir"){

				Form.fields("AUX_NOME_SER").value("");
				Form.fields("AUX_USER_DEV").value("Aprovado");
				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
				Form.fields("PROX_RESP").value(atendNomes);

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}							
			if(auxRota == "Aprovar e Encaminhar"){

				// Limpar campos cada vez que definir a categoria
				Form.fields("PROX_ETAPA").value("");
				Form.fields("PROX_RESP").value("")	
				Form.fields("AUX_NOME_SER").value("");

				// Definir campos que vão receber as listas de opções
				listaCat = Form.fields("CATEGORIA_NOVO");
				listaSub = Form.fields("SUBCATEGORIA_NOVO");

				// Tornar visíveis campos para direcionamento
				Form.fields('DESTINO_NOVO').visible(true);
				Form.fields('CATEGORIA_NOVO').visible(true);
				Form.fields('SUBCATEGORIA_NOVO').visible(true);
				Form.fields('SETOR_NOVO').visible(true);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', true);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', true);
				Form.fields('SETOR_NOVO').setRequired('aprovar', true);

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
					modelo    = atualizarModelo(Form.fields("SETOR_NOVO").value());
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
					
					modelo = atualizarModelo(Form.fields("SETOR_NOVO").value());
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

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						

					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}

				});		

				// Carregar subcategorias caso o usuário queira alterar somente a subcategoria
				Form.fields("SUBCATEGORIA_NOVO").subscribe("CLICK", function(itemId, data, response) {
			
					auxCat = Form.fields("CATEGORIA_NOVO").value();

					var piloto = "";

					if(auxUniOrig == "13" || auxUniOrig == "15"){
						piloto = "Sim";
					} else piloto = "Não";						
					
					// Se o destino for um grupo da UAD carrega as subcategorias do grupo
					if(auxGrupo.toString().substring(0,2) == "99"){
						listaSubcategorias(auxGrupo, auxCat, listaSub, piloto);
					}
					// Se o destino for um grupo do PA carrega as subcategorias do modelo
					if(auxGrupo.toString().substring(0,2) != "99"){
						listaSubcategorias(modelo, auxCat, listaSub, piloto);
					}
		
				});			

				// Alteração de subcategoria e validar resposnável por CRL produtos
				Form.fields("SUBCATEGORIA_NOVO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {	
		
					auxSub  = Form.fields("SUBCATEGORIA_NOVO").value();
		
					if(auxUnidade == "99" && modelo == "99_credito"){

						if(auxCat == "Assinatura Eletrônica" && auxSub == "Solicitações em Geral"){ 
						
							novoGrupo = "99_credito_ass_eletronica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else
						if(auxCat == "CRL" && auxSub == "Consignado/Consórcio"){ 
							
							novoGrupo = "99_cons_consig";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && auxSub == "Alteração CRL Cartão"){ 
							
							novoGrupo = "99_credito_crl_cartao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "CRL" && (auxSub == "Pessoa Física" || auxSub == "Pessoa Jurídica" ||auxSub == "Pessoa Jurídica (Maior)") ||
						auxCat == "Dúvidas" && auxSub == "Análise de Crédito" || auxCat == "Fábrica de Limites" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_crl_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Contrapartes Conectadas (Grupo Econômico)" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_grupo_economico";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação de Crédito" && (auxSub == "Cheque Especial / Conta Garantida" || auxSub == "Títulos Descontados" || auxSub == "Financiamento" || auxSub == "Giro Parcelado / Crédito Pessoal" ||
						auxSub == "Giro Rotativo" || auxSub == "Consignado Privado" || auxSub == "Renegociação"|| auxSub == "Limite Cartão Acima de R$45.000,00")){ 
							
							novoGrupo = "99_credito_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liquidação" && (auxSub == "Amortização" || auxSub == "Quitação" || auxSub == "Financiamento")){ 
							
							novoGrupo = "99_credito_liquidacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && (auxSub == "Cancelamento" || auxSub == "Garantias Reais" ||auxSub == "Solicitação de Boleto") ||
						auxCat == "Dúvidas" && auxSub == "Controles" || auxCat == "Documentos Pendentes" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_operacoes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Operações de Crédito" && auxSub == "Prorrogação"){ 
							
							novoGrupo = "99_credito_prorrogacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else
						if(auxCat == "Liberação Talão de Cheque" && auxSub == "Solicitações em Geral"){ 
							
							novoGrupo = "99_credito_talao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}																									
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							

					}	
					else
					if(auxUnidade == "99" && modelo == "99_rural"){

						if(auxCat == "Crédito Rural" && auxSub == "Análise Técnica"){ 
						
							novoGrupo = "99_rural_analise_tecnica";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Financiamento BNDES" && (auxSub == "Dúvidas" || auxSub == "Quitação" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_bndes";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}
						else				
						if(auxCat == "Crédito Rural" && auxSub == "CRL" || auxCat == "Financiamento BNDES" && auxSub == "CRL"){ 
						
							novoGrupo = "99_rural_crl";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}		
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Fiscalização"){ 
						
							novoGrupo = "99_rural_fiscalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && (auxSub == "Dúvidas" || auxSub == "Outros")){ 
						
							novoGrupo = "99_rural_geral";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else				
						if(auxCat == "Crédito Rural" && auxSub == "Liberação de Crédito"){ 
						
							novoGrupo = "99_rural_liberacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}													
						else{

							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}

					}
					else
					if(auxUnidade == "99" && modelo == "99_cadastro"){
		
						if(auxCat == "Conta Capital" && auxSub == "Campanha de Capitalização 2022"){ 
						
							novoGrupo = "99_cadastro_capitalizacao";
							Form.fields("AUX_GRUPO").value(novoGrupo);
							console.log("novo grupo: " + novoGrupo);
						
						}	
						else{
		
							console.log("grupo padrão: " + auxGrupo);
							Form.fields("AUX_GRUPO").value(auxGrupo);
			
						}							
		
					}					
					else{

						console.log("grupo padrão: " + auxGrupo);
						Form.fields("AUX_GRUPO").value(auxGrupo);

					}	

					Form.apply();
		
				});							

				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento");
				Form.fields("AUX_USER_DEV").value("Encaminhado");

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}
			if(auxRota != "Aprovar e Encaminhar"){

				Form.fields('DESTINO_NOVO').visible(false);
				Form.fields('CATEGORIA_NOVO').visible(false);
				Form.fields('SUBCATEGORIA_NOVO').visible(false);
				Form.fields('SETOR_NOVO').visible(false);
				Form.fields('DESTINO_NOVO').setRequired('aprovar', false);
				Form.fields('CATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SUBCATEGORIA_NOVO').setRequired('aprovar', false);
				Form.fields('SETOR_NOVO').setRequired('aprovar', false);

			}	

			Form.apply();

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
			
		// Execução de SQL com a lista de usuários do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("PROX_RESP").value(response);
			Form.fields("ATENDENTES_NOMES").value(response);

			// Bloquear alterações de rota
			Form.fields("AUX_ROTA").disabled(true);

			Form.apply();
		
		});	
		
		// Execução de SQL com a lista de login do grupo de atendimento
		Form.fields("AUX_SQL_GRUPO_LOGIN").subscribe("SET_FIELD_VALUE", function(itemId, data, response) {
			
			// Atualizar responsáveis pelo atendimento
			Form.fields("ATENDENTES").value(response).apply();
		
		});				

	}

	if(codigoEtapa == AVALIAR_ATENDIMENTO){

		Form.fields("AUX_ROTA").subscribe("CHANGE", function(itemId, data, response) {
			
			auxRota      = Form.fields("AUX_ROTA").value();
			auxGrupo     = Form.fields("DESTINO").value();
			nomeInic     = Form.fields("INICIADOR").value();
			loginInic    = Form.fields("AUX_INICIADOR").value();
			nomeUser     = Form.fields("AUX_USER").value();
			modelo       = Form.fields("AUX_MODELO").value();
			responsaveis = Form.fields("RESPONSAVEIS").value();
			atendentes   = Form.fields("ATENDENTES").value();
			respNomes    = Form.fields("RESPONSAVEIS_NOMES").value();
			atendNomes   = Form.fields("ATENDENTES_NOMES").value();
			
			if(auxRota == "Arquivar Chamado" ){

				Form.fields("AVALIACAO").visible(true);
				Form.fields("AV_ADICIONAL").visible(true);
				Form.fields('AVALIACAO').setRequired('aprovar', true);

				listaAvaliacao();

				Form.fields("PROX_ETAPA").value("Arquivar Chamado").apply();
				Form.fields("PROX_RESP").value(nomeUser).apply();

				Form.actions('aprovar').disabled(false);
				Form.actions('rejeitar').disabled(true);

			}		
			
			if(auxRota == "Reabrir Chamado" ){

			
				Form.fields("AUX_NOME_SER").value("").apply();
				Form.fields("AUX_USER_DEV").value("Devolvido").apply();
				Form.fields("PROX_ETAPA").value("Assumir Chamado em Andamento").apply();
				Form.fields("PROX_RESP").value(atendNomes).apply();

				Form.fields("AVALIACAO").visible(false);
				Form.fields('AVALIACAO').setRequired('aprovar', false);	
				Form.fields("AV_ADICIONAL").visible(false);
				Form.actions('aprovar').disabled(true);
				Form.actions('rejeitar').disabled(false);

			}	
			
			Form.apply();

		});	

		Form.grids("G_ANEXOS").fields("ANEXOS_SUP_INT").subscribe("CHANGE", function (itemId, data, response) {

			auxData = timeHasCome();
			nomeUser = Form.fields("AUX_NOME_SER").value();

			Form.grids("G_ANEXOS").fields("NOME_ADD").value(nomeUser).apply();
			Form.grids("G_ANEXOS").fields("HORA_ADD").value(auxData).apply();


		});			
		
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

		//Form.groups("FORM_AUX").visible(true).apply();
		
		//Carregar varáveis iniciais
		auxCiclo  = Form.fields("AUX_CICLO").value();
		auxOrigem = Form.fields("ORIGEM").value();
		auxCat    = Form.fields("CATEGORIA").value();
		modelo    = atualizarModelo(Form.fields("SETOR").value());		
		
		// Definir quais campos vão receber as listas de opções
		listaCat  = Form.fields("CATEGORIA");
		listaSub  = Form.fields("SUBCATEGORIA");

		// Carregar listas para exibir formulário de chamado já registrado
		var validar = Form.fields("RESPONSAVEIS").value();

		if(validar != undefined){

			// Listas
			var addResp1  = Form.fields("ADD_RESPONSAVEL1");
			var addResp2  = Form.fields("ADD_RESPONSAVEL2");
			var addAtend1 = Form.fields("ADD_ATENDENTE1");
			var addAtend2 = Form.fields("ADD_ATENDENTE2");

			// Consultas
			var addUsers = Form.fields("AUX_LISTA_USUARIOS").value();
			var addSetor = Form.fields("AUX_LISTA_SETORES").value();

			// Carregar listas
			atualizarListasUsuarios(addUsers, addResp1, addResp2);
			atualizarListasUsuarios(addSetor, addAtend1, addAtend2);	
		
		}

		// Carregar lista de rotas
		listaRotas();		

		// Exibir dados do associado para chamados registrados
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"         || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao"   || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"        || modelo == "99_rural"       || 
		   modelo == "99_seguros"     || modelo == "99_conectividade"  || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			// Campos referentes aos dados do cliente habilitados para edição a pedido do setor de Cadastro da UAD, atualizado em 31/08/2022
			//Form.fields('CPF_CNPJ').visible(true).apply();
			//Form.fields('NOME_RAZAO').visible(true).apply();
			//Form.fields('PESSOA_CONTA').visible(true).apply();

			if(modelo == "99_cadastro" && auxCat == "Inclusão/Exclusão de Bens"){

				Form.fields('BEM_AQUISICAO').visible(true);

			}
				
		}		

		// Chamado novo
		if(auxCiclo == 1){

			Form.actions('aprovar').disabled(true);
			Form.actions('cancel').disabled(true);

		}
		
		// Chamado devolvido
		else if(auxCiclo > 1){

			// Bloquear informações do chamado
			Form.fields("DESTINO").disabled(true);
			Form.fields("SETOR").disabled(true);
			Form.fields("CATEGORIA").disabled(true);
			Form.fields("SUBCATEGORIA").disabled(true);
			Form.fields("ASSUNTO").disabled(true);
			Form.fields("DESCRICAO").disabled(true);

			// Bloquear opções de privacidade
			Form.fields("ADD_RESPONSAVEL1").disabled(true);
			Form.fields("ADD_RESPONSAVEL2").disabled(true);
			Form.fields("ADD_ATENDENTE1").disabled(true);
			Form.fields("ADD_ATENDENTE2").disabled(true);
			Form.fields("PRIVADO").disabled(true);

			if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"         || modelo == "99_cartoes"     ||
			   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao"   || modelo == "99_cons_consig" || 
			   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"        || modelo == "99_rural"       || 
			   modelo == "99_seguros"     || modelo == "99_conectividade"  || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){
 
				// Campos referentes aos dados do cliente disponíveis para edição em caso de chamado devolvido a pedido do setor de Cadastro da UAD. Atualizado em 31/08/2022
				Form.fields("CPF_CNPJ").visible(true);
				Form.fields("NOME_RAZAO").visible(true);
				Form.fields("PESSOA_CONTA").visible(true);
	
				if(modelo == "99_cadastro" && auxCat == "Inclusão/Exclusão de Bens"){
					
					Form.fields("BEM_AQUISICAO").disabled(true);
	
				}

				if(modelo == "99_cadastro"){

					Form.fields('DOC_INVALIDO').visible(true);
					Form.fields('DOC_NAO_ENVIADO').visible(true);
					Form.fields('DOC_INSUFICIENTE').visible(true);
					Form.fields('FALTA_INFORMACOES').visible(true);
					Form.fields('INFO_SISBR').visible(true);
					Form.fields('AUTORIZACAO').visible(true);					
					Form.fields('APROVACAO').visible(true);		
					Form.fields('PEDIDO_PA').visible(true);		
					
					Form.fields('DOC_INVALIDO').disabled(true);
					Form.fields('DOC_NAO_ENVIADO').disabled(true);
					Form.fields('DOC_INSUFICIENTE').disabled(true);
					Form.fields('FALTA_INFORMACOES').disabled(true);
					Form.fields('INFO_SISBR').disabled(true);
					Form.fields('AUTORIZACAO').disabled(true);					
					Form.fields('APROVACAO').disabled(true);						
					Form.fields('PEDIDO_PA').disabled(true);						

				}				
				 
		 	}			

			Form.fields('HISTORICO').setRequired('aprovar', true);

			Form.actions('aprovar').disabled(true);
			Form.actions('rejeitar').disabled(true);

		}
			
	}	
	
	if(codigoEtapa == ASSUMIR_NOVO || codigoEtapa == ASSUMIR_ANDAMENTO){

		//Form.groups("FORM_AUX").visible(true).apply();

		// Carregar variáveis iniciais
		nomeUser   = Form.fields("AUX_NOME_SER").value();
		auxCat     = Form.fields("CATEGORIA").value();
		auxUserDev = Form.fields("AUX_USER_DEV").value();
		modelo     = atualizarModelo(Form.fields("SETOR").value());

		// Listas
		var addResp1  = Form.fields("ADD_RESPONSAVEL1");
		var addResp2  = Form.fields("ADD_RESPONSAVEL2");
		var addAtend1 = Form.fields("ADD_ATENDENTE1");
		var addAtend2 = Form.fields("ADD_ATENDENTE2");

		// Consultas
		var addUsers = Form.fields("AUX_LISTA_USUARIOS").value();
		var addSetor = Form.fields("AUX_LISTA_SETORES").value();

		console.log("addUsers: " + addUsers);
		console.log("addSetor: " + addSetor);

		// Carregar listas
		atualizarListasUsuarios(addUsers, addResp1, addResp2);
		atualizarListasUsuarios(addSetor, addAtend1, addAtend2);

		// Mostrar campo pessoa
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"       || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao" || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"      || modelo == "99_rural"       || 
		   modelo == "99_seguros"     || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			Form.fields('CPF_CNPJ').visible(true);
			Form.fields('NOME_RAZAO').visible(true);
			Form.fields('PESSOA_CONTA').visible(true);
		
			Form.fields('CPF_CNPJ').readOnly(true);
			Form.fields('NOME_RAZAO').readOnly(true);
			Form.fields('PESSOA_CONTA').readOnly(true);
			 
	 	}		

		// Atualizar informações de chamados encaminhados
		if(auxUserDev == "Encaminhado"){

			auxCat = Form.fields("CATEGORIA_NOVO").value();
			auxSub = Form.fields("SUBCATEGORIA_NOVO").value();
	
			Form.fields("CATEGORIA").value(auxCat).apply();
			Form.fields("SUBCATEGORIA").value(auxSub).apply();				

		}		

		// Definir a próxima etapa e o próximo responsável
		Form.fields("PROX_ETAPA").value("Realizar Atendimento").apply();
		Form.fields("PROX_RESP").value(nomeUser).apply();		

	}	

	if(codigoEtapa == REALIZAR_ATENDIMENTO || codigoEtapa == AGUARDANDO_TERCEIROS || codigoEtapa == APROVAR_GERENTE ||
	   codigoEtapa == APROVACAO_ALCADA_2 || codigoEtapa == APROVACAO_ALCADA_3 || codigoEtapa == AVALIAR_ATENDIMENTO){

		//Form.groups("FORM_AUX").visible(true).apply();

		// Ocutlar checkbox cadastro
		Form.fields('DOC_INVALIDO').visible(false);
		Form.fields('DOC_NAO_ENVIADO').visible(false);
		Form.fields('DOC_INSUFICIENTE').visible(false);
		Form.fields('FALTA_INFORMACOES').visible(false);
		Form.fields('AUTORIZACAO').visible(false);					
		Form.fields('APROVACAO').visible(false);			
		
		// Carregar variáveis iniciais
		auxDestino = Form.fields("DESTINO").value();
		nomeUser   = Form.fields("AUX_NOME_SER").value();
		grupoAtend = Form.fields("AUX_GRUPO").value();
		auxRota    = Form.fields("AUX_ROTA").value();
		auxCat     = Form.fields("CATEGORIA").value();
		modelo     = atualizarModelo(Form.fields("SETOR").value());
		
		// Listas
		var addResp1  = Form.fields("ADD_RESPONSAVEL1");
		var addResp2  = Form.fields("ADD_RESPONSAVEL2");
		var addAtend1 = Form.fields("ADD_ATENDENTE1");
		var addAtend2 = Form.fields("ADD_ATENDENTE2");

		// Consultas
		var addUsers = Form.fields("AUX_LISTA_USUARIOS").value();
		var addSetor = Form.fields("AUX_LISTA_SETORES").value();

		// Carregar listas
		atualizarListasUsuarios(addUsers, addResp1, addResp2);
		atualizarListasUsuarios(addSetor, addAtend1, addAtend2);		

		console.log("rota: " + auxRota);

		// Mostrar campos de chamados encaminhados
		if(auxRota == "Encaminhar Chamado" || auxRota == "Aprovar e Encaminhar"){

			console.log("Chamado Encaminhado");

			Form.fields('DESTINO_NOVO').visible(true);
			Form.fields('SETOR_NOVO').visible(true);
			Form.fields('CATEGORIA_NOVO').visible(true);
			Form.fields('SUBCATEGORIA_NOVO').visible(true);			

		}

		// Mostrar campos de chamados avaliados
		if(auxRota == "Arquivar Chamado"){

			console.log("Chamado Avaliado");

			Form.fields("AVALIACAO").visible(true);
			Form.fields("AV_ADICIONAL").visible(true);

		}

		// Chamados cadastro aguardando terceiros
		if(codigoEtapa == AGUARDANDO_TERCEIROS && grupoAtend == "99_cadastro"){

			Form.fields('CADASTRO_COMPLETO').visible(true);
			Form.fields('CADASTRO_COMPLETO').lineBreak('SIMPLES');
			Form.fields('CADASTRO_COMPLETO').setRequired('aprovar', true);

			Form.fields('DOC_INVALIDO').visible(true);
			Form.fields('DOC_NAO_ENVIADO').visible(true);
			Form.fields('DOC_INSUFICIENTE').visible(true);
			Form.fields('FALTA_INFORMACOES').visible(true);
			Form.fields('INFO_SISBR').visible(true);
			Form.fields('AUTORIZACAO').visible(true);					
			Form.fields('APROVACAO').visible(true);	
			Form.fields('PEDIDO_PA').visible(true);	

		}

		// Chamados cadastro devolvidos
		if(codigoEtapa == REALIZAR_ATENDIMENTO && grupoAtend == "99_cadastro"){

			Form.fields('CADASTRO_COMPLETO').visible(true);
			Form.fields('CADASTRO_COMPLETO').lineBreak('SIMPLES');
			Form.fields('CADASTRO_COMPLETO').setRequired('aprovar', true);

			if(auxRota == "Devolver ao Solicitante" || auxRota == "Aguardando Terceiros"){

				Form.fields('DOC_INVALIDO').visible(true);
				Form.fields('DOC_NAO_ENVIADO').visible(true);
				Form.fields('DOC_INSUFICIENTE').visible(true);
				Form.fields('FALTA_INFORMACOES').visible(true);
				Form.fields('INFO_SISBR').visible(true);
				Form.fields('AUTORIZACAO').visible(true);					
				Form.fields('APROVACAO').visible(true);	
				Form.fields('PEDIDO_PA').visible(true);	

			}

		}		

		// Mostrar campo pessoa
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"       || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao" || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"      || modelo == "99_rural"       || 
		   modelo == "99_seguros"     || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			Form.fields('CPF_CNPJ').visible(true);
			Form.fields('NOME_RAZAO').visible(true);
			Form.fields('PESSOA_CONTA').visible(true);
		
			Form.fields('CPF_CNPJ').readOnly(true);
			Form.fields('NOME_RAZAO').readOnly(true);
			Form.fields('PESSOA_CONTA').readOnly(true);
			 
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

		Form.actions('aprovar').disabled(true);
		Form.actions('rejeitar').disabled(true);

	}		

	if(codigoEtapa == ARQUIVAR_CHAMADO){ 

		nomeUser = Form.fields("AUX_NOME_SER").value();
		auxCat   = Form.fields("CATEGORIA").value();
		modelo   = atualizarModelo(Form.fields("SETOR").value());

		// Listas
		var addResp1  = Form.fields("ADD_RESPONSAVEL1");
		var addResp2  = Form.fields("ADD_RESPONSAVEL2");
		var addAtend1 = Form.fields("ADD_ATENDENTE1");
		var addAtend2 = Form.fields("ADD_ATENDENTE2");

		// Consultas
		var addUsers = Form.fields("AUX_LISTA_USUARIOS").value();
		var addSetor = Form.fields("AUX_LISTA_SETORES").value();

		// Carregar listas
		atualizarListasUsuarios(addUsers, addResp1, addResp2);
		atualizarListasUsuarios(addSetor, addAtend1, addAtend2);		

		// Mostrar campo pessoa
		if(modelo == "99_adquirencia" || modelo == "99_cadastro"       || modelo == "99_cambio"       || modelo == "99_cartoes"     ||
		   modelo == "99_cob_adm"     || modelo == "99_cobranca"       || modelo == "99_compensascao" || modelo == "99_cons_consig" || 
		   modelo == "99_contas_pagar"|| modelo == "99_correspondente" || modelo == "99_credito"      || modelo == "99_rural"       || 
		   modelo == "99_seguros"     || modelo == "99_agenciavirtual" ||(modelo == "99_tecnologia" && auxCat == "Suporte Canais de Atendimento")){

			Form.fields('CPF_CNPJ').visible(true);
			Form.fields('NOME_RAZAO').visible(true);
			Form.fields('PESSOA_CONTA').visible(true);
		
			Form.fields('CPF_CNPJ').readOnly(true);
			Form.fields('NOME_RAZAO').readOnly(true);
			Form.fields('PESSOA_CONTA').readOnly(true);
			 
	 	}		

	}		

	Form.apply();
}

/*
 * Define novas regras de validação dos campos
 */
function setValidators(){

	// Validar grid anexos não carregados
	if(codigoEtapa == REGISTRAR_CHAMADO){
		
		Form.actions("aprovar").subscribe("SUBMIT", function (itemId, action, reject) {
			
			loginInic  = Form.fields("AUX_INICIADOR").value();
			substituto = Form.fields("NOME_SUBSTITUTO").value();
			addResp1   = Form.fields("ADD_RESPONSAVEL1").get();
			addResp2   = Form.fields("ADD_RESPONSAVEL2").get();
			addAtend1  = Form.fields("ADD_ATENDENTE1").get();
			addAtend2  = Form.fields("ADD_ATENDENTE2").get();
			r1Nome     = Form.fields("ADD_RESPONSAVEL1").rawValue();
			r2Nome     = Form.fields("ADD_RESPONSAVEL2").rawValue();
			a1Nome     = Form.fields("ADD_ATENDENTE1").rawValue();
			a2Nome     = Form.fields("ADD_ATENDENTE2").rawValue();	

			console.log("r1Nome: " + r1Nome);
			console.log("r2Nome: " + r2Nome);
			console.log("a1Nome: " + a1Nome);
			console.log("a2Nome: " + a2Nome);

			if(r1Nome != ""){

				if(loginInic == addResp1.value[0]){

					console.log("Iniciador incluído como adicional 1");
					Form.fields('ADD_RESPONSAVEL1').errors(['Responsável não pode ser o mesmo que está abrindo o chamado.']).apply();
					reject();
					Form.apply();				
	
				}
				else
				if(substituto == addResp1.value[0]){

					console.log("Substituto incluído como adicional 1");
					Form.fields('ADD_RESPONSAVEL1').errors(['O substituto do solicitante não pode ser incluído como responsável.']).apply();
					reject();
					Form.apply();					

				}
				else{

					console.log("Validação responsável adicional 1 ok");

				}

			}
			
			if(r2Nome != ""){

				if(loginInic == addResp2.value[0]){

					console.log("Iniciador incluído como adicional 2");
					Form.fields('ADD_RESPONSAVEL2').errors(['Responsável não pode ser o mesmo que está abrindo o chamado.']).apply();
					reject();
					Form.apply();				
	
				}
				else
				if(substituto == addResp2.value[0]){

					console.log("Substituto incluído como adicional 1");
					Form.fields('ADD_RESPONSAVEL2').errors(['O substituto do solicitante não pode ser incluído como responsável.']).apply();
					reject();
					Form.apply();					

				}				
				else{

					console.log("Validação responsável adicional 2 ok");

				}				

			}
			
			if(r1Nome != "" && r2Nome != ""){

				if(addResp1.value[0] == addResp2.value[0]){

					console.log("Responsáveis iguais");
					Form.fields('ADD_RESPONSAVEL1').errors(['Responsáveis não podem ser iguais.']).apply();
					reject();
					Form.apply();

				}
				else{

					console.log("Validação de responsáveis ok");

				}

			}
			
			if(a1Nome != "" && a2Nome != ""){

				if(addAtend1.value[0] === addAtend2.value[0]){

					console.log("Atendentes iguais");
					Form.fields('ADD_ATENDENTE1').errors(['Atendentes não podem ser iguais.']).apply();
					reject();
					Form.apply();

				}
				else{

					console.log("Validação de atendentes ok");

				}				

			}		

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

function atualizarModelo(response){

	var model = "";

	if(response == "Administrativo")									 { model = "99_administrativo"; }
	if(response == "Agência Virtual")									 { model = "99_agenciavirtual"; }
	if(response == "Adquirencia")										 { model = "99_adquirencia";    }
	if(response == "Cadastro")											 { model = "99_cadastro";       }
	if(response == "Câmbio")											 { model = "99_cambio";         }
	if(response == "Cartões")											 { model = "99_cartoes";        }
	if(response == "Cobrança Adm")										 { model = "99_cob_adm";        }
	if(response == "Cobrança Bancária")									 { model = "99_cobranca";       }
	if(response == "Compensação")										 { model = "99_compensascao";   }
	if(response == "Consórcio / Consignado / Previ / Benefícios do INSS"){ model = "99_cons_consig";    }
	if(response == "Conectividade")					                     { model = "99_conectividade";  }
	if(response == "Contabilidade")										 { model = "99_contabilidade";  }
	if(response == "Contas a Pagar")									 { model = "99_contas_pagar";   }
	if(response == "Correspondente")									 { model = "99_correspondente"; }
	if(response == "Crédito Comercial")									 { model = "99_credito";        }
	if(response == "Crédito Rural")										 { model = "99_rural";          }
	if(response == "Governança")										 { model = "99_governanca";     }
	if(response == "Marketing")											 { model = "99_marketing";      }
	if(response == "Processos")											 { model = "99_processos";      }
	if(response == "PLD")												 { model = "99_pld";            }
	if(response == "RH / Gestão de Pessoas")							 { model = "99_rh"; 			}
	if(response == "Seguros")											 { model = "99_seguros";        }
	if(response == "Tecnologia")										 { model = "99_tecnologia"; 	}
	if(response == "Tesouraria")										 { model = "99_tesouraria"; 	}

	return model;

}

function atualizarListasUsuarios(response, lista1, lista2){

	console.log("Dados: " + response);

	var listaUsersOrig = response.split(";");
	var newObj = [];

	listaUsersOrig.forEach(function (dados) {

		// Separar resultado do select, uma coluna para cada @
		var nome  = dados.split("@")[0];
		var login = dados.split("@")[1];

		// Objeto com os parâmetros de nome e login
		var newOption = {name: nome, value: login};

		// Usar o método push para adicionar o objeto no array
		newObj.push(newOption);

	});

	// Carregar o array de objetos nas listas
	lista1.addOptions(newObj).apply();
	lista2.addOptions(newObj).apply();

}

function atualizarGrupoOrigem(origemPrincipal, origemGrupo, origemUnidade){

	if(origemUnidade == "99"){

		Form.fields("AUX_GRUPO_ORIGEM").value(origemGrupo).apply();

	}
	else{

		if(origemPrincipal == "01 - Papanduva")			   { Form.fields("AUX_GRUPO_ORIGEM").value("01_papanduva").apply(); 	  }
		if(origemPrincipal == "02 - Mafra")				   { Form.fields("AUX_GRUPO_ORIGEM").value("02_mafra").apply(); 		  }
		if(origemPrincipal == "03 - Santa Terezinha")	   { Form.fields("AUX_GRUPO_ORIGEM").value("03_santa_terezinha").apply(); }
		if(origemPrincipal == "04 - Rio da Anta")		   { Form.fields("AUX_GRUPO_ORIGEM").value("04_rio_anta").apply(); 	      }
		if(origemPrincipal == "05 - Santa Cecília")		   { Form.fields("AUX_GRUPO_ORIGEM").value("05_santa_cecilia").apply();   }
		if(origemPrincipal == "06 - Major Vieira")		   { Form.fields("AUX_GRUPO_ORIGEM").value("06_major_vieira").apply();    }
		if(origemPrincipal == "07 - Ijuí")				   { Form.fields("AUX_GRUPO_ORIGEM").value("07_ijui").apply(); 		      }
		if(origemPrincipal == "08 - Santo Ângelo")		   { Form.fields("AUX_GRUPO_ORIGEM").value("08_santo_angelo").apply();    }
		if(origemPrincipal == "09 - Vitor Meireles")	   { Form.fields("AUX_GRUPO_ORIGEM").value("09_vitor_meireles").apply();  }
		if(origemPrincipal == "10 - Monte Castelo")		   { Form.fields("AUX_GRUPO_ORIGEM").value("10_monte_castelo").apply();   }
		if(origemPrincipal == "11 - Craveiro")			   { Form.fields("AUX_GRUPO_ORIGEM").value("11_craveiro").apply(); 	      }
		if(origemPrincipal == "12 - Witmarsum")			   { Form.fields("AUX_GRUPO_ORIGEM").value("12_witmarsum").apply();       }
		if(origemPrincipal == "13 - Navegantes")		   { Form.fields("AUX_GRUPO_ORIGEM").value("13_navegantes").apply();      }
		if(origemPrincipal == "14 - São João do Itaperiú") { Form.fields("AUX_GRUPO_ORIGEM").value("14_sao_joao").apply();        }
		if(origemPrincipal == "15 - Gravatá")			   { Form.fields("AUX_GRUPO_ORIGEM").value("15_gravata").apply();         }
		if(origemPrincipal == "16 - São Borja")			   { Form.fields("AUX_GRUPO_ORIGEM").value("16_sao_borja").apply();       }		

	}

}

function atualizarGrupoDestino(destinoPrincipal, destinoGrupo, destinoUnidade){

	if(destinoUnidade == "99"){

		Form.fields("AUX_GRUPO_DESTINO").value(destinoGrupo).apply();

	}
	else{

		if(destinoPrincipal == "01 - Papanduva")			{ Form.fields("AUX_GRUPO_DESTINO").value("01_papanduva").apply(); 	    }
		if(destinoPrincipal == "02 - Mafra")				{ Form.fields("AUX_GRUPO_DESTINO").value("02_mafra").apply(); 		    }
		if(destinoPrincipal == "03 - Santa Terezinha")	    { Form.fields("AUX_GRUPO_DESTINO").value("03_santa_terezinha").apply(); }
		if(destinoPrincipal == "04 - Rio da Anta")		    { Form.fields("AUX_GRUPO_DESTINO").value("04_rio_anta").apply(); 	    }
		if(destinoPrincipal == "05 - Santa Cecília")		{ Form.fields("AUX_GRUPO_DESTINO").value("05_santa_cecilia").apply();   }
		if(destinoPrincipal == "06 - Major Vieira")		    { Form.fields("AUX_GRUPO_DESTINO").value("06_major_vieira").apply();    }
		if(destinoPrincipal == "07 - Ijuí")				    { Form.fields("AUX_GRUPO_DESTINO").value("07_ijui").apply(); 		    }
		if(destinoPrincipal == "08 - Santo Ângelo")		    { Form.fields("AUX_GRUPO_DESTINO").value("08_santo_angelo").apply();    }
		if(destinoPrincipal == "09 - Vitor Meireles")	    { Form.fields("AUX_GRUPO_DESTINO").value("09_vitor_meireles").apply();  }
		if(destinoPrincipal == "10 - Monte Castelo")		{ Form.fields("AUX_GRUPO_DESTINO").value("10_monte_castelo").apply();   }
		if(destinoPrincipal == "11 - Craveiro")			    { Form.fields("AUX_GRUPO_DESTINO").value("11_craveiro").apply(); 	    }
		if(destinoPrincipal == "12 - Witmarsum")			{ Form.fields("AUX_GRUPO_DESTINO").value("12_witmarsum").apply();       }
		if(destinoPrincipal == "13 - Navegantes")		    { Form.fields("AUX_GRUPO_DESTINO").value("13_navegantes").apply();      }
		if(destinoPrincipal == "14 - São João do Itaperiú") { Form.fields("AUX_GRUPO_DESTINO").value("14_sao_joao").apply();        }
		if(destinoPrincipal == "15 - Gravatá")			    { Form.fields("AUX_GRUPO_DESTINO").value("15_gravata").apply();         }
		if(destinoPrincipal == "16 - São Borja")			{ Form.fields("AUX_GRUPO_DESTINO").value("16_sao_borja").apply();       }		

	}

}

function chamadoUAD(origemPrincipal){

	console.log("Chamado origem UAD");
	var grupo = "";

	if(origemPrincipal == "99 - Administrativo")    { grupo = "99_administrativo"; } 
	if(origemPrincipal == "99 - Adquirencia")       { grupo = "99_adquirencia";    } 
	if(origemPrincipal == "99 - Agência Virtual")   { grupo = "99_agenciavirtual"; } 
	if(origemPrincipal == "99 - Arquivo")           { grupo = "99_arquivo";        } 
	if(origemPrincipal == "99 - Cadastro")          { grupo = "99_cadastro";       } 
	if(origemPrincipal == "99 - Caixa Itinerante")  { grupo = "99_caixa_itiner";   } 
	if(origemPrincipal == "99 - Câmbio")            { grupo = "99_cambio"; 		   } 
	if(origemPrincipal == "99 - Cartões")           { grupo = "99_cartoes"; 	   } 
	if(origemPrincipal == "99 - Cobrança Adm")      { grupo = "99_cob_adm"; 	   } 
	if(origemPrincipal == "99 - Cobrança Bancária") { grupo = "99_cobranca";       } 
	if(origemPrincipal == "99 - Compensação")       { grupo = "99_compensascao";   } 
	if(origemPrincipal == "99 - Conectividade")     { grupo = "99_conectividade";  } 
	if(origemPrincipal == "99 - Consorcio e Consig"){ grupo = "99_cons_consig";    } 
	if(origemPrincipal == "99 - Contabilidade")     { grupo = "99_contabilidade";  } 
	if(origemPrincipal == "99 - Contas a Pagar")    { grupo = "99_contas_pagar";   } 
	if(origemPrincipal == "99 - Controle Interno")  { grupo = "99_cont_interno";   } 
	if(origemPrincipal == "99 - Correspondente")    { grupo = "99_correspondente"; } 
	if(origemPrincipal == "99 - Crédito Comercial") { grupo = "99_credito"; 	   } 
	if(origemPrincipal == "99 - Crédito Rural")     { grupo = "99_rural"; 		   } 
	if(origemPrincipal == "99 - Direx")             { grupo = "99_direx"; 		   } 
	if(origemPrincipal == "99 - Governança")        { grupo = "99_governanca";     } 
	if(origemPrincipal == "99 - Marketing")         { grupo = "99_marketing"; 	   } 
	if(origemPrincipal == "99 - PLD")               { grupo = "99_pld"; 		   } 
	if(origemPrincipal == "99 - Processos")         { grupo = "99_processos"; 	   } 
	if(origemPrincipal == "99 - RH")                { grupo = "99_rh"; 			   } 
	if(origemPrincipal == "99 - Riscos")            { grupo = "99_riscos"; 		   } 
	if(origemPrincipal == "99 - Seguros")           { grupo = "99_seguros"; 	   } 
	if(origemPrincipal == "99 - Tecnologia")        { grupo = "99_tecnologia"; 	   } 
	if(origemPrincipal == "99 - Tesouraria")        { grupo = "99_tesouraria"; 	   } 

	return grupo;

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

function listaSubcategorias(grupo, categoria, lista, piloto){

	console.log("Piloto: " + piloto);

	// Piloto Navegantes e Gravatá
	if(grupo == "99_cadastro"){

		if(piloto == "Sim") { subcategoriasCadastroPiloto (categoria, lista); } else
		if(piloto == "Não") { subcategoriasCadastro       (categoria, lista); }

	} else

	if(grupo == "99_adquirencia")    { subcategoriasAdquirencia    (categoria, lista); } else
	if(grupo == "99_agenciavirtual") { subcategoriasAgenciaVirtual (categoria, lista); } else
	if(grupo == "99_cons_consig")    { subcategoriasConsorcio      (categoria, lista); } else
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
			(categoria == "Estorno / Isenção"  && subcategoria == "Outros"                     ) ||
			(categoria == "Cartão Puro Débito" && subcategoria == "Solicitação"                ) ||
			(categoria == "Limite Cartão"      && subcategoria == "Cancelamento de Limite"     ) )
			
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

		if((categoria == "CRL" && subcategoria == "Alteração CRL Cartão") ||
		   (categoria == "Liberação de Crédito" && subcategoria == "Limite Cartão Acima de R$45.000,00") )

		  { Form.fields("AUX_APROV_LIDER").value("Sim").apply(); }
		
		else { Form.fields("AUX_APROV_LIDER").value("Não").apply(); }

	}		
	else{ 
	
		Form.fields("AUX_APROV_LIDER").value("Não").apply(); 
	
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
			{ name: 'PIX - Transações',        value: 'PIX - Transações'       },
			{ name: 'PIX - API',               value: 'PIX - API'              },
			{ name: 'Sicoob Pay',              value: 'Sicoob Pay'             },
			{ name: 'ATMs - Funções',          value: 'ATMs - Funções'         },
			{ name: 'Depósito de Cheques',     value: 'Depósito de Cheques'    },
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
			{ name: 'Emissão de Títulos',                                   value: 'Emissão de Títulos'                                   },
			{ name: 'Folha de Pagamento / Contas a Pagar / Transferências', value: 'Folha de Pagamento / Contas a Pagar / Transferências' },
			{ name: 'API Cobrança Bancária',                                value: 'API Cobrança Bancária'                                },
		]).apply();

	}	

}

function categoriasConsorcio(lista){

	lista.addOptions([
		{ name: 'Consórcio',          value: 'Consórcio'          },
		{ name: 'Consignado',         value: 'Consignado'         },
		{ name: 'Previ',              value: 'Previ'              },
		{ name: 'Benefícios do INSS', value: 'Benefícios do INSS' },
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
			{ name: 'Previdência Colaboradores',                               value: 'Previdência Colaboradores'                              },
		]).apply();

	}
	else
	if(categoria == "Benefícios do INSS"){

		lista.addOptions([	
			{ name: 'Mudança de Domicílio Bancário',            value: 'Mudança de Domicílio Bancário'           },
			{ name: 'Prova de Vida',                            value: 'Prova de Vida'                           },
			{ name: 'Comprovante de Entrega de Cartão / Senha', value: 'Comprovante de Entrega de Cartão / Senha'},
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
			{ name: 'Quitação',              value: 'Quitação'             },
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
			{ name: 'Limite Cartão Acima de R$45.000,00', value: 'Limite Cartão Acima de R$45.000,00'},				
			{ name: 'Cheque Especial / Conta Garantida',  value: 'Cheque Especial / Conta Garantida' },
			{ name: 'Títulos Descontados',                value: 'Títulos Descontados'               },
			{ name: 'Financiamento',                      value: 'Financiamento'                     },
			{ name: 'Giro Parcelado / Crédito Pessoal',   value: 'Giro Parcelado / Crédito Pessoal'  },
			{ name: 'Giro Rotativo',                      value: 'Giro Rotativo'                     },
			{ name: 'Consignado Privado',                 value: 'Consignado Privado'                },
			{ name: 'Renegociação',                       value: 'Renegociação'                      },
		]).apply();

	}
	else
	if(categoria == "Operações de Crédito"){

		lista.addOptions([	
			{ name: 'Prorrogação',           value: 'Prorrogação'           },
			{ name: 'Cancelamento',          value: 'Cancelamento'          },
			{ name: 'Garantias Reais',       value: 'Garantias Reais'       },
			{ name: 'Solicitação de Boleto', value: 'Solicitação de Boleto' },
		]).apply();

	}
	else
	if(categoria == "Dúvidas"){

		lista.addOptions([	
			{ name: 'Controles',             value: 'Controles'            },
			{ name: 'Análise de Crédito',    value: 'Análise de Crédito'   },
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
			{ name: 'Solicitação',                  value: 'Solicitação'           },
			{ name: 'Majoração',                    value: 'Majoração'             },
			{ name: 'Cancelamento de Limite',       value: 'Cancelamento de Limite'},
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
			{ name: 'Representante Legal/Procurador',                               value: 'Representante Legal/Procurador'                              },
			{ name: 'Consignado Recurso CCS (INSS, Municipal, Estadual e Federal)', value: 'Consignado Recurso CCS (INSS, Municipal, Estadual e Federal)'},
			{ name: 'Consignado Privado',                                           value: 'Consignado Privado'                                          },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',                               value: 'Consórcio/Sipag/Cartões/Câmbio'                              },
			{ name: 'Inclusão/Exclusão de Relacionamento',                          value: 'Inclusão/Exclusão de Relacionamento'                         },
			{ name: 'Atualização Cadastral',                                        value: 'Atualização Cadastral'                                       },
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
			{ name: 'Campanha de Capitalização 2022',    value: 'Campanha de Capitalização 2022'  },
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

function subcategoriasCadastroPiloto(categoria, lista){

	if(categoria == "Atualização Pessoa Física"){

		lista.addOptions([	
			{ name: 'Representante Legal/Procurador',                               value: 'Representante Legal/Procurador'                              },
			{ name: 'Consignado Recurso CCS (INSS, Municipal, Estadual e Federal)', value: 'Consignado Recurso CCS (INSS, Municipal, Estadual e Federal)'},
			{ name: 'Consignado Privado',                                           value: 'Consignado Privado'                                          },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',                               value: 'Consórcio/Sipag/Cartões/Câmbio'                              },
			{ name: 'Inclusão/Exclusão de Relacionamento',                          value: 'Inclusão/Exclusão de Relacionamento'                         },
			{ name: 'Atualização Cadastral',                                        value: 'Atualização Cadastral'                                       },
			{ name: 'CRL - Tomador de Crédito',                                     value: 'CRL - Tomador de Crédito'                                    },
		]).apply();

	}
	else
	if(categoria == "Atualização Pessoa Jurídica"){

		lista.addOptions([	
			{ name: 'Representante Legal/Procurador',       value: 'Representante Legal/Procurador'     },
			{ name: 'Consórcio/Sipag/Cartões/Câmbio',       value: 'Consórcio/Sipag/Cartões/Câmbio'     },
			{ name: 'Inclusão/Exclusão de Relacionamento',  value: 'Inclusão/Exclusão de Relacionamento'},
			{ name: 'Atualização Cadastral',                value: 'Atualização Cadastral'              },
			{ name: 'CRL - Tomador de Crédito',             value: 'CRL - Tomador de Crédito'           },
		]).apply();

	}
	else	
	if(categoria == "Atualização Produtor Rural"){

		lista.addOptions([	
			{ name: 'Produtor Rural',           value: 'Produtor Rural'          },
			{ name: 'BNDES',                    value: 'BNDES'                   },
			{ name: 'Outros',                   value: 'Outros'                  },
			{ name: 'CRL - Tomador de Crédito', value: 'CRL - Tomador de Crédito'},
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
			{ name: 'Campanha de Capitalização 2022',    value: 'Campanha de Capitalização 2022'  },			
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

function textoPadrao(modelo, categoria, subcategoria){

	Form.fields("DESCRICAO").value("").apply();

	if(modelo == "99_cartoes"){

		if(categoria == "Suporte ao Produto" && subcategoria == "App Sicoobcard"){

			Form.fields("DESCRICAO").value
			("Telefone do cadastro do app (celular):"
			+"\n\e-mail:"
			+"\n\Descrição ou evidência do erro.").apply();

		}
		else
		if(categoria == "Fraude" && subcategoria == "Abertura do Processo de Contestação dos Valores"){

			Form.fields("DESCRICAO").value
			("Tipo de cartão:"
			+"\n\Valor total de fraude (somando todas as transações):"
			+"\n\**Para valores acima de R$ 150,00 é obrigatório o envio de boletim de ocorrência**."
			+"\n\Anexar a carta devidamente preenchida e assinada pelo cooperado responsável pelo cartão"
			+"\n\Disponivel na intranet MK Sense – Cartões Sicoobcard – fraude/desacordo.").apply();

		}
		else
		if(categoria == "Desacordo Comercial" && subcategoria == "Abertura do Processo de Contestação dos Valores"){

			Form.fields("DESCRICAO").value
			("Tipo de cartão:"
			+"\n\Valor total do desacordo (somando todas as transações):"
			+"\n\Neste caso precisamos de evidências entre o cooperado e empresa/prestador de serviços."
			+"\n\Ex: protocolo de ligação, e-mail, print de conversa entre outros e a data do contato."
			+"\n\Anexar a carta devidamente preenchida e assinada pelo cooperado responsável pelo cartão."
			+"\n\Disponivel na intranet MK Sense – Cartões Sicoobcard – fraude/desacordo.").apply();

		}		
		else
		if(categoria == "Coopera" && subcategoria == "Suporte ao Aplicativo"){

			Form.fields("DESCRICAO").value
			("A pessoa que está tentando acesso é 1° titular da conta ?"
			+"\n\Os dados como telefone e e-mail estão atualizados no Capes?"
			+"\n\A tentativa de cadastro pelo app foi feita? Sim ou não?"
			+"\n\Erro ou dúvida no acesso via ao aplicativo ou portal?"
			+"\n\Qual erro apresenta? (se possível anexar o erro)"
			+"\n\Email:"
			+"\n\Telefone Celular:").apply();

		}	
		else
		if(categoria == "Coopera" && subcategoria == "Suporte ao Site"){

			Form.fields("DESCRICAO").value
			("A pessoa que está tentando acesso é 1° titular da conta ?"
			+"\n\Os dados como telefone e e-mail estão atualizados no Capes?"
			+"\n\A tentativa de cadastro pelo site foi feita? Sim ou não?"
			+"\n\Erro ou dúvida no acesso via ao aplicativo ou portal?"
			+"\n\Qual erro apresenta? (se possível anexar o erro)"
			+"\n\Email:"
			+"\n\Telefone Celular:").apply();

		}	
		else
		if(categoria == "Cartões Salário" && subcategoria == "Solicitação de Cartões Não Gerados Automaticamente"){

			Form.fields("DESCRICAO").value
			("Conta/empresa:").apply();

		}	
		else
		if(categoria == "Cartões Salário" && subcategoria == "Cancelamento de Cartão"){

			Form.fields("DESCRICAO").value
			("Conta/empresa:").apply();

		}	
		else
		if(categoria == "Estorno / Isenção" && subcategoria == "Anuidade"){

			Form.fields("DESCRICAO").value
			("Conta corrente:"
			+"\n\Valor:").apply();

		}	
		else
		if(categoria == "Estorno / Isenção" && subcategoria == "Pagamento em Duplicidade"){

			Form.fields("DESCRICAO").value
			("Conta corrente:"
			+"\n\Valor:").apply();

		}	
		else
		if(categoria == "Limite Cartão" && subcategoria == "Solicitação"){

			Form.fields("DESCRICAO").value
			("Dados do produto contratado:"
			+"\n\Bandeira (Visa ou Master)"
			+"\n\Produto (de acordo com o portfólio de cartões da Cooperativa):"
			+"\n\Valor do limite:"
			+"\n\Tipo do limite (único ou duplo):"
			+"\n\Data de vencimento da fatura (3, 7, 11, 19 ou 22):"
			+"\n\Opção de débito em conta (Sim ou Não):"
			+"\n\Possui Restrição? Sim ou Não?"
			+"\n\É colaborador? Sim ou Não").apply();

		}	
		else
		if(categoria == "Limite Cartão" && subcategoria == "Majoração"){

			Form.fields("DESCRICAO").value
			("Dados do produto contratado:"
			+"\n\Bandeira (Visa ou Master)"
			+"\n\Valor do limite:"
			+"\n\Tipo do limite (único ou duplo):"
			+"\n\Possui Restrição? Sim ou Não?"
			+"\n\É colaborador? Sim ou Não").apply();

		}	
		else
		if(categoria == "Limite Cartão" && subcategoria == "Cancelamento de Limite"){

			Form.fields("DESCRICAO").value
			("Dados do produto contratado:"
			+"\n\Bandeira (Visa ou Master)"
			+"\n\Valor do limite a cancelar:"
			+"\n\*Atenção no caso cancelamento de limite total, ou seja limite igual a  0 a conta cartão será cancelada"
			+" por gentileza providenciar o termo de cancelamento assinado pelo cooperado e anexar neste chamado.").apply();

		}	
		else
		if(categoria == "Cartão Puro Débito" && subcategoria == "Solicitação"){

			Form.fields("DESCRICAO").value
			("\n\Dados do produto contratado:"
			+"\n\Bandeira (Visa ou Master)").apply();

		}	
		else
		if(categoria == "Cartão Provisório" && subcategoria == "Solicitação"){

			Form.fields("DESCRICAO").value
			("\n\Descrever a quantidade hoje somente na bandeira Visa.").apply();

		}																		

	}
	else
	if(modelo == "99_adquirencia"){

		if(categoria == "Suporte ao Produto" && subcategoria == "Suporte Máquinas"){

			Form.fields("DESCRICAO").value
			("Tipo de Equipamento:"
			+"\n\Se for Sipaguinha Tipo de equipamento GERTEC ou PAX:"
			+"\n\Se for máquina móvel ou fixa N° de série dela (verso do equipamento):"
			+"\n\Qual erro que apresenta?"
			+"\n\Telefone para contato com estabelecimento: "
			+"\n\Preferência de CHIP:"
			+"\n\Endereço: Se o cadastro estiver atualizado não precisa informar, caso o cadastro esteja desatualizado e o cooperado mudou de endereço, por gentileza informar:"
			+"\n\Rua, Bairro, Cidade, CEP, Número, Ponto de referência."
			+"\n\Ponto de referência/Complemento:"
			+"\n\Horário de atendimento:"
			+"\n\Horário de almoço:"
			+"\n\Dias da semana: ").apply();

		}
		else
		if(categoria == "Suporte ao Produto" && subcategoria == "Reativação de Cadastro Suspenso"){

			Form.fields("DESCRICAO").value
			("Quantidade de equipamento (s)"
			+"\n\Tipo de Equipamento (s):"
			+"\n\No caso de máquina móvel - Preferência de Chip de qual operadora?"
			+"\n\A última tecnologia do estabelecimento foi recolhida?"
			+"\n\Endereço completo:"
			+"\n\Ponto de referência/Complemento:"
			+"\n\Horário de atendimento, horário de almoço (que fecha o estabelecimento):"
			+"\n\Responsável e telefone para contato:").apply();

		}	
		else
		if(categoria == "Suporte ao Produto" && subcategoria == "Máquina Adicional"){

			Form.fields("DESCRICAO").value
			("Quantidade de equipamento (s)"
			+"\n\Tipo de Equipamento (s):"
			+"\n\No caso de máquina móvel - Preferência de Chip de qual operadora?"
			+"\n\Endereço completo:"
			+"\n\Ponto de referência/Complemento:"
			+"\n\Horário de atendimento, horário de almoço (que fecha o estabelecimento):"
			+"\n\Responsável e telefone para contato.").apply();

		}	
		else
		if(categoria == "Suporte ao Produto" && subcategoria == "Recolhimento de Máquina"){

			Form.fields("DESCRICAO").value
			("Tipo de Equipamento:"
			+"\n\N° de série (verso do equipamento):"
			+"\n\Possui somente um? Se for mais enviar foto do verso da tecnologia."
			+"\n\Endereço completo:"
			+"\n\Ponto de referência/Complemento:"
			+"\n\Horário de atendimento, horário de almoço (que fecha o estabelecimento):").apply();

		}	
		else
		if(categoria == "Suporte ao Produto" && subcategoria == "Dúvidas Vendas / Antecipação / Taxas"){

			Form.fields("DESCRICAO").value
			("Possui filial?"
			+"\n\Se for dúvida de venda /antecipação"
			+"\n\data e valor da venda/antecipação:").apply();

		}	
		else
		if(categoria == "Suporte ao Produto" && subcategoria == "Aplicativo / Portal"){

			Form.fields("DESCRICAO").value
			("Telefone do cadastro do app (celular):"
			+"\n\e-mail:"
			+"\n\Se for algum erro, descrição ou evidência do erro.").apply();

		}	
		else
		if(categoria == "Suporte ao Produto" && subcategoria == "Bobinas"){

			Form.fields("DESCRICAO").value
			("Endereço completo:"
			+"\n\Ponto de referência/Complemento:"
			+"\n\Horário de atendimento, horário de almoço (que fecha o estabelecimento).").apply();

		}	
		else
		if(categoria == "Credenciamento" && subcategoria == "POO / POS"){

			Form.fields("DESCRICAO").value
			("Informações obrigatórias"
			+"\n\Assunto: (preencher com o nome do estabelecimento / associado)"
			+"\n\Informações obrigatórias:"
			+"\n\Conta Corrente:"
			+"\n\Cadastro atualizado há mais de 60 dias? Sim ou Não"
			+"\n\E-mail e celular cadastrado (empresa e sócios/administradores)? Sim ou Não"
			+"\n\Horário de atendimento:"
			+"\n\Horário de almoço:"
			+"\n\Dias da semana:"
			+"\n\Responsável pelo recebimento:"
			+"\n\Telefone responsável pelo equipamento:"
			+"\n\Ponto de referência: "
			+"\n\Chip Operadora 1:"
			+"\n\Chip Operadora 2:"
			+"\n\Tipo de máquina:"
			+"\n\Quantidade:"
			+"\n\Antecipação automática? Sim ou Não:"
			+"\n\Taxa: Negociada ou Tabelada?"
			+"\n\Ticket médio:"
			+"\n\Faturamento aquirencia anual:").apply();

		}
		else
		if(categoria == "Credenciamento" && subcategoria == "Sipaguinha"){

			Form.fields("DESCRICAO").value
			("Obrigatório o envio das seguintes informações no chamado para emissão da proposta:"
			+"\n\Cadastro atualizado a menos de 60 dias no Sisbr?"
			+"\n\Razão Social –Razão social que consta cadastrada na receita federal."
			+"\n\CPF/CNPJ:"
			+"\n\Quantidade de equipamento (s):"
			+"\n\Tipo de Equipamento: FABRICANTE PAX D195 (único modelo disponível)"
			+"\n\Qual preferência do chip da operadora (que funciona melhor na região) para esta máquina?"
			+"\n\1°"
			+"\n\2°"
			+"\n\Antecipação automática SIM ou NÃO?"
			+"\n\Proprietário(s) - Informar todos"
			+"\n\Percentual de participação societária(%):"
			+"\n\Pessoa Exposta Politicamente (Proprietário )"
			+"\n\Nacionalidade (Proprietário )"
			+"\n\Nome:"
			+"\n\CPF:"
			+"\n\Data de Nascimento:"
			+"\n\Celular do proprietário (com DDD):"
			+"\n\Telefone para contato:"
			+"\n\E-mail:"
			+"\n\Endereço do estabelecimento:"
			+"\n\Rua:"
			+"\n\Número:"
			+"\n\Bairro:"
			+"\n\Cidade/Cep:"
			+"\n\Conta Corrente para creditar os valores da máquina."
			+"\n\Horário de atendimento e dias da semana que o estabelecimento funciona."
			+"\n\Faturamento Anual(R$)"
			+"\n\Valor do Ticket Médio(R$)"
			+"\n\Faturamento Anual do Grupo(R$)"
			+"\n\Certifique-se de que as informações estão corretas."
			+"\n\Eles serão a base de consulta para o envio do link de pagamento, via e-mail ou SMS, e do equipamento, via empresa de logística."
			+"\n\Qualquer inconsistência poderá comprometer o processo de pagamento, a logística de entrega e a nossa"
			+" imagem, é claro! além disso, o insucesso na entrega do equipamento, causado pelo envio de dados errados,"
			+" implicará em custos para a Cooperativa, que terá que assumir o custo de reenvio do equipamento.").apply();

		}
		else
		if(categoria == "Credenciamento" && subcategoria == "TEF / E-commerce / Link"){

			Form.fields("DESCRICAO").value
			("Possui alguma negociação de taxas que deve ser aplicada?  (se sim informar)"
			+"\n\Ou se trata de taxa tabela?"
			+"\n\Credenciamento TEF, E-commerce ou Link de Pagamento?"
			+"\n\Casos de TEF:"
			+"\n\Conta Corrente:"
			+"\n\Cadastro atualizado há menos de 60 dias?"
			+"\n\E-mail e celular cadastrado (empresa e sócios/administradores)?"
			+"\n\Horário de atendimento:"
			+"\n\Horário de almoço:"
			+"\n\Dias da semana:"
			+"\n\Chip Operadora 1:"
			+"\n\Chip Operadora 2:"
			+"\n\Quantidade:"
			+"\n\Antecipação automática?"
			+"\n\Taxa: Negociada ou Tabelada?"
			+"\n\Ticket médio:"
			+"\n\Faturamento adquirência anual:"
			+"\n\Já possui tecnologia para o TEF, provedor e integrador?").apply();

		}	
		else
		if(categoria == "Negociação de Taxas" && subcategoria == "Solicitações em Geral"){

			Form.fields("DESCRICAO").value
			("A negociação será para Sipag ou Sipaguinha? (INFORMAÇÃO OBRIGATÓRIA)."
			+"\n\Por gentileza informar aqui todos os CNPJs da empresa para negociação (serão considerados apenas os CNPJs informados)."
			+"\n\Qual tecnologia possui hoje:"
			+"\n\Evidência de taxas concorrência (foto)."
			+"\n\Qual taxa da concorrência hoje?"
			+"\n\MDR e antecipação?"
			+"\n\Valor do faturamento mensal R$ (em casos de cliente novo ou de outra adquirente, se for Sipag temos acesso a esta informação)."
			+"\n\Valor e % de vendas por bandeira - Visa, Master, Cabal, Elo e Hiper."
			+"\n\E a % de vendas por modalidade Crédito, débito e parcelado."
			+"\n\Em casos de negociação em fase de andamento ou chamado fechado, deve ser referenciado esse número de chamado.").apply();

		}	
		else
		if(categoria == "Reembolso Aluguel" && subcategoria == "Solicitações em Geral"){

			Form.fields("DESCRICAO").value
			("Valor cobrado:"
			+"\n\Se for algum erro, descrição ou evidência do erro.").apply();

		}	
		else
		if(categoria == "Relatórios" && subcategoria == "Solicitações em Geral"){

			Form.fields("DESCRICAO").value
			("Descrever o relatório/demanda para auxilio.").apply();

		}	
		else
		if(categoria == "Troca de Domicílio Bancário" && subcategoria == "Solicitações em Geral"){

			Form.fields("DESCRICAO").value
			("SIPAG/REDE E CIELO – Troca de Domicílio Bancário"
			+"\n\Banco, agência e conta (que os pagamentos estão atualmente):"
			+"\n\Banco, agência e conta (que será realizado a troca de domicílio):"
			+"\n\Sipag"
			+"\n\O próprio associado Pode ligar na na central  Sipag telefone 01461 3004- 2013 e solicitar a alteração de domicílio bancário."
			+"\n\Caso o associado não queira ligar, podemos solicitar a alteração do domicílio com  o formulário 30121 assinado pelo associado").apply();

		}																					

	}
	else
	if(modelo == "99_cambio"){

		if(categoria == "Suporte ao Produto" && subcategoria == "Solicitação de Limite de Cãmbio"){

			Form.fields("DESCRICAO").value
			("A empresa irá operar com Dólar ou Euro?"
			+"\n\a. Quando o cooperado começou a operar com câmbio. Isso no mercado em si, não somente no Sicoob." 
			+"\n\b. Modalidade de câmbio (importação, exportação ou operações financeiras)." 
			+"\n\c. Volume mensal de operações aproximado para pedirmos o limite (em dólares)"
			+"\n\d. Principais parceiros comerciais que mantém relacionamento no exterior (nome da empresa e país de origem)"
			+"\n\e. Principais instituições (bancos e corretoras) com as quais opera no comércio exterior" 
			+"\n\f. Parecer de defesa da cooperativa (histórico de relacionamento com o cliente, objetivos com o produto,  etc)" 
			+"\n\g. Qual valor de limite necessário?"
			+"\n\h. Para importação e exportação ou financeiro?"
			+"\n\i. Possui capital integralizado e conta corrente ativa com relacionamento superior a 6 meses?"
			+"\n\j. Possuir cadastro ATUALIZADO, válido e compartilhado com o Bancoob pelo CAPES de acordo com as regras estabelecidas pelo MIG de Cadastro?" 
			+"\n\O cooperado está habilitado no RADAR?"
			+"\n\Se sim precisa além da atualização cadastral alterar no cadastro dele:"
			+"\n\Selecionar as opções:"
			+"\n\Importar câmbio  - Exportar câmbio"
			+"\n\*Autorizo Consulta no sistema de Crédito do Banco Central").apply();

		}		

	}
	else
	if(modelo == "99_correspondente"){

		if(categoria == "Novo Correspondente" && subcategoria == "Abertura de Correspondente Bancário"){

			Form.fields("DESCRICAO").value
			("Para abertura de novo correspondente 1° deve ser verificado com o gerente do PA e em seguida com a Diretoria da Cooperativa."
			+"\n\Após isso precisa ser enviado a seguinte documentação no chamado:"
			+"\n\a.	Se a empresa, seus sócios e diretores não tenham nenhuma restrição cadastral;"
			+"\n\b.	Pesquisa cadastral detalhada sobre a idoneidade e a experiência bancária da empresa proponente e de todos os seus sócios, inclusive dos diretores;"
			+"\n\c.	Análise da capacidade financeira da empresa."
			+"\n\i.	Cópia documentos da empresa (Contrato Social ou Ata);"
			+"\n\ii.	Cartão de autógrafos dos representantes/procuradores;"
			+"\n\iii.	Cópia do CPF, RG e comprovante de endereço dos representantes e/ou procuradores;"
			+"\n\iv.	Cópia do cartão de CNPJ vigente;"
			+"\n\v.	    Principais sócios/acionistas;"
			+"\n\vi.	Procuração de pessoa física (cópia CPF, RG e comprovante de endereço);"
			+"\n\Vii.   Procuração de pessoa jurídica (cópia do cartão CNPJ vigente e documentos da empresa - Contrato Social ou Estatuto Social e suas posteriores alterações e as atas em que foram eleitos os representantes)."
			+"\n\e.	P.A. deverá enviar cópia da CCB do limite de correspondente contratado;"
			+"\n\f.	A empresa proponente assinar o termo  cumprir as normas publicadas pelo BCB, pelo Bancoob e pela cooperativa, mediante termo ou contrato formalizado."
			+"\n\g.	Cadastro de pessoa jurídica, preenchido e assinado pelos representantes da empresa."
			+"\n\h.	 Cadastro de pessoa física, preenchido e assinado, dos sócios e dos diretores da"
			+"\n\i.	Comprovante de propriedade dos bens relacionados na ficha cadastral de pessoa jurídica e de pessoas físicas"
			+"\n\j.	Em caso de restrições, as respectivas certidões negativas, cancelamentos ou anuências."
			+"\n\k.	Caso exista apontamento em uma das certidões, justificativa com documentos"
			+"\n\(acordo com o fisco, ação questionando o imposto, por exemplo)."
			+"\n\l.  Três últimos balanços/DRE (demonstrativo de resultado do exercício)."
			+"\n\m. Balancete/DRE recente, não superior a três meses, na data da análise."
			+"\n\n. Última declaração de Imposto de Renda."
			+"\n\o. Faturamento dos últimos 24 meses, devidamente assinado por representante(s) legal(is) da empresa e de seu contador."
			+"\n\p. Apresentação da rubrica contábil “financiamento” de balancete recente, devendo constar bancos, limite, risco, tipo de operação, garantias e vencimento."
			+"\n\q. Contratos de Leasing, constando espécie de bem, vencimento, valor do contrato, prestação do contrato e vencimento final."
			+"\n\r. Certidões negativas de débitos fiscais (CNDS) atualizadas e documentos:"
			+"\n\CNDS - Certidão Conjunta Negativa de Débitos Relativos a Tributos Federais e á Divida Ativa da União (SRFB)"	 
			+"\n\CNDS - Certidão Negativa de Débitos Relativos ás Contribuições Previdenciárias e ás de Terceiros (SRFB)."	 
			+"\n\CNDS - Certidão Negativa de Débitos Estaduais – Secretaria de Estado da Fazenda"	 
			+"\n\CNDS - Certidão Negativa de Débitos – Prefeitura Municipal"	 
			+"\n\CNDS - Certificado de Regularidade do FGTS (CRF)"	 
			+"\n\CNDS - Certidão Negativa de Débitos Trabalhistas (http://www.tst.jus.br/certidao)"
			+"\n\Cópia da Guia do INSS e Certif.Regul do FGTS"
			+"\n\Consultar a Receita Federal sobre a situação do CNPJ da empresa"	
			+"\n\Alvará Funcionamento Prefeitura"
			+"\n\s. Caso a empresa participe de outras sociedades, ou tenha, em seu capital,participação de pessoas jurídicas, é necessária a apresentação de toda"
			+"\n\t. Cópia do último contracheque (hollerit) ou declaração de rendimentos dos sócios e diretores;"
			+"\n\ u. Última declaração do Imposto de Renda dos sócios e diretores"
			+"\n\v. Comprovante de endereço (conta de água, luz ou telefone fixo) dos sócios e diretores."
			+"\n\w. Cadastro de Pessoa Jurídica - Ficha cadastral assinada"
			+"\n\ x.Cadastro de Pessoa Física dos Sócios e Diretores  - Ficha cadastral assinada"
			+"\n\z .cópia folha pagamento dos funcionários.").apply();

		}		

	}	
	else
	if(modelo == "99_rural"){

		if(categoria == "Crédito Rural" && subcategoria == "Fiscalização"){

			Form.fields("DESCRICAO").value
			("Bom dia / Boa tarde,"
			+"\n\Segue informações sobre a fiscalização ref. contrato nº __________________________."
			+"\n\Obs: Enviar laudo de fiscalização devidamente preenchido, conforme modelos disponibilizados na Base de Conhecimento "
			+" (caminho: Mksense > Crédito > Base de Conhecimento Crédito Rural > Fiscalização) + fotos.").apply();

		}	
		else
		if(categoria == "Crédito Rural" && subcategoria == "Liberação de Crédito"){

			Form.fields("DESCRICAO").value
			("Bom dia / Boa tarde"
			+"\n\Por gentileza liberar contrato Nº ___________________."
			+"\n\Informar se associado aguarda a liberação na agência:"
			+"\n\(   ) SIM"
			+"\n\(   ) NÃO "
			+"\n\Selecionar modalidade:"
			+"\n\Plataforma Rural:"
			+"\n\CUSTEIO"
			+"\n\(   ) milho"
			+"\n\(   ) soja"
			+"\n\(   ) fumo"
			+"\n\(   ) pecuário"
			+"\n\(   ) demais finalidades __________________"
			+"\n\INVESTIMENTO:"
			+"\n\(   ) investimento agrícola/pecuário"
			+"\n\(   ) comercialização/industrialização"
			+"\n\Plataforma Comercial – linhas para produtor rural:"
			+"\n\(   ) investimento produtor rural"
			+"\n\(   ) custeio produtor rural"
			+"\n\(   ) veículos produtor rural"
			+"\n\(   ) demais finalidades ___________________"
			+"\n\CAPITAL DE GIRO: "
			+"\n\(   ) Com valor R$ __________________ "
			+"\n\(   ) Sem valor").apply();

		}		
		else
		if(categoria == "Crédito Rural" && subcategoria == "Análise Técnica"){

			Form.fields("DESCRICAO").value
			("Informar qual tipo de proposta. Ex: Financiamento veículo, Credito Pessoal, Repactuação, etc."
			+"\n\Valor:"
			+"\n\Solicitamos a análise antecipada da proposta acima pelo seguinte motivo:_______________________.").apply();

		}		
		else
		if(categoria == "Financiamento BNDES" && subcategoria == "Quitação"){

			Form.fields("DESCRICAO").value
			("Bom dia / Boa tarde,"
			+"\n\Por gentileza, realizar a Quitação / Amortização do Contrato Nº ____________________"
			+"\n\(    ) Pagamento de Parcela - Vencimento ___/___/____. "
			+"\n\(    ) Pagamento Parcial - valor de R$ _______________."
			+"\n\(    ) Amortizar saldo Devedor de Capital de Giro (quando o Contrato permanecerá vigente até o vencimento da operação)."
			+"\n\(    ) Quitação Total do Contrato. "
			+"\n\ * Operação Via BNDES, não é possível antecipação de parcelas, somente quitação total do contrato."
			+"\n\Observações: ").apply();

		}		
		else
		if(categoria == "Crédito Rural" && subcategoria == "CRL"){

			Form.fields("DESCRICAO").value
			("Produto que será necessário alteração:"
			+"\n\Valor da operação:"
			+"\n\Prazo:"
			+"\n\Parecer:").apply();

		}								

	}
	else
	if(modelo == "99_credito"){

		if(categoria == "Dúvidas" && subcategoria == "Análise de Crédito"){

			Form.fields("DESCRICAO").value
			("Informar qual tipo de proposta. Ex: Financiamento veículo, Credito Pessoal, Repactuação, etc."
			+"\n\Valor:"
			+"\n\Solicitamos a análise antecipada da proposta acima pelo seguinte motivo:_______________________.").apply();

		}	
		else	
		if(categoria == "Liberação de Crédito" && subcategoria == "Limite Cartão Acima de R$45.000,00"){

			Form.fields("DESCRICAO").value
			("Para limites superiores a R$ 45.000,00 é necessário parecer padrão conforme CCI Interna CCI 015/2021."
			+"\n\Se o limite solicitado for superior ao limite do CRL necessário parecer padrão."
			+"\n\Se o limite solicitado for para um colaborador é necessário o envio do parecer."
			+"\n\Se esta solicitação estiver dentro do limite do CRL"
			+"\n\Até R$ 45.000,00, sem restrições e não sendo colaborador nos informar apenas:"
			+"\n\Dados do produto contratado:"
			+"\n\Bandeira (Visa ou Master)"
			+"\n\Produto (de acordo com o portfólio de cartões da Cooperativa):"
			+"\n\Valor do limite:"
			+"\n\Tipo do limite (único ou duplo):"
			+"\n\Data de vencimento da fatura (3, 7, 11, 19 ou 22):"
			+"\n\Opção de débito em conta (Sim ou Não):"
			+"\n\Possui Restrição? Sim ou Não? – "
			+"\n\É colaborador? Sim ou Não?").apply();

		}	
		else
		if(categoria == "CRL"){

			Form.fields("DESCRICAO").value
			("Produto que será necessário alteração:"
			+"\n\Valor da operação:"
			+"\n\Prazo:"
			+"\n\Parecer:").apply();

		}		

	}
	else
	if(modelo == "99_contas_pagar"){

		if(categoria == "Pagamento a Fornecedores" && subcategoria == "Solicitações em Geral"){

			Form.fields("DESCRICAO").value
			("1.Nome do Fornecedor"
			+"\n\2.Tipo do Documento (Nota e Boleto, CF, Recibo)"
			+"\n\3.Valor"
			+"\n\4.Detalhar a Despesa (Fornecedor normal, Patrocínio/Doação, Reembolso)"
			+"\n\5.Dados bancários caso não tenha boleto.").apply();

		}		

	}
	else
	if(modelo == "99_rh"){

		if(categoria == "Férias" && subcategoria == "Solicitação de Férias"){

			Form.fields("DESCRICAO").value
			("Quantos dias de férias deseja tirar?"
			+"\n\Deseja vender 10 dias?"
			+"\n\Quem ficará responsável pelos e mail na sua ausência?").apply();

		}		

	}	
	else
	if(modelo == "99_cadastro"){

		if(subcategoria == "CRL - Tomador de Crédito"){

			Form.fields("DESCRICAO").value
			("Orientações para preenchimento do chamado conforme CCI 015/2021 \n"
			+"\n INFORMAÇÕES OBRIGATÓRIAS "
			+"\n a)	Data de associação (tomador):"
			+"\n b)	Risco do associado (tomador):"
			+"\n c)	Risco da operação (justificar casos > C):"
			+"\n d)	Score de todos os envolvidos (apresentar justificativa para scores baixos): \n"
			+"\n INFORMAÇÕES COMPLEMENTARES:"
			+"\n a)	IAP (tomador):"
			+"\n b)	Seguro Prestamista (justificar quando for inexistente):"
			+"\n c)	Anotações cadastrais e de crédito de todos os envolvidos na operação: RSA, PEM, PEP, Infrações a Legislação Ambiental, Serasa e Bacen (anexar CNDs/Processos quando cabíveis, mencionar quando possuir restrições/pendências anexando as consultas e comprovantes de regularização):" 
			+"\n d)	Renda/Faturamento de todos os envolvidos na operação: Explanar fonte da renda. Exemplo: Assalariado, IR, Previsão de Faturamento, Ramo de Atividade, Produção Agrícola etc.:"
			+"\n e)	Capacidade de pagamento (justificar se a margem financeira na súmula for negativa ou insuficiente/Movimentação em conta/Rendimentos não comprovados):"
			+"\n f)	Endividamento do tomador na Cooperativa (mencionar quais são as operações em aberto): "
			+"\n g)	Histórico de liquidações do tomador (mencionar se histórico positivo com pagamentos pontuais/antecipados e/ou justificativa em caso de atrasos):"
			+"\n h)	Garantias (justificar quando não houver garantia):"
			+"\n i)	Finalidade do crédito:"
			+"\n j)	Demais Informações: Renovação de Crédito (mencionar quando for o caso e se a operação anterior se encontra liquidada ou em aberto), Informações Comerciais, Estado Civil, Informações Subjetivas etc.:"
			+"\n k)	Posição do PA (Favorável ou Não Favorável):").apply();

		}
		else
		if(subcategoria == "Consignado Recurso CCS (INSS, Municipal, Estadual e Federal)"){

			Form.fields("DESCRICAO").value
			("INFORMAÇÕES OBRIGATÓRIAS"
			+"\n a)	ÓRGÃO CONSIGNANTE (INSS, ESTADUAL SANTA CATARINA, MUNICIPAL (E QUAL MUNICÍPIO), FEDERAL):"
			+"\n b)	QUAIS DOCS ESTÃO SENDO ANEXADO NA ATUALIZAÇÃO (docs obrigatórios para a operação: documento pessoal, comprovante de residência dentro do prazo de 90 dias, contracheque (em casos de INSS, demonstrativo do benefício que contenha o número do benefício do tomador):"
			+"\n c)	02 REFERÊNCIAS PESSOAIS:"
			+"\n d)	TELEFONE DE CONTATO:"
			+"\n e)	E-MAIL (SE POSSUIR):"
			+"\n f)	POSSUI REPRESENTANTE LEGAL/PROCURADOR? SIM OU NÃO:"
			+"\n g)	VALOR DA PARCELA:"
			+"\n h)	VALOR DA OPERAÇÃO:"
			+"\n i)	TAXA:"
			+"\n j)	PRAZO:"
			+"\n k)	MARGEM DISPONÍVEL DO CLIENTE (quando se tratar de consignado INSS, anexar consulta de margem realizada na plataforma de crédito / *Se for SIAPE, anexar a consulta de margem realizada a plataforma de crédito)* – consultar setor para identificação deste procedimento: \n"
			+"\n CONDIÇÕES OBRIGATÓRIAS PARA CONCESSÃO DE CRÉDITO - NÃO APAGAR"
			+"\n a)	Nos casos de consignado INSS que o valor da parcela ou a soma das parcelas já existentes de outros contratos ultrapassar 30% da renda do tomador, é necessário apresentar parecer."
			+"\n b)	Para preenchimento do parecer usar modelo disponível nas opções de ajuda do chamado. Ícone '...' no canto superior direito da tela, menu 'Informações'."
			+"\n c)	Quando se tratar de refinanciamento de qualquer convênio, é necessário o parecer pois até o momento da liberação da operação serão duas parcelas lançadas no sistema, ultrapassando o limite de margem de acordo com a lei."
			+"\n d)	COMPARTILHAR O CADASTRO COM O BANCOOB, PREENCHER AS INFORMAÇÕES PROFISSIONAIS NOVO E DADOS DO CLIENTE NA ABA PARCEIRO DE NEGÓCIO E NA ABA PRODUTOS BANCOOB."
			+"\n e)	APÓS ATUALIZAÇÃO, ENCAMINHAR CHAMADO PARA CRL BASE 3084 E 001, CRÉDITO COMERCIAL > CRL > CONSIGNADO/CONSÓRCIO."
			+"\n f)	QUANDO EXISTIR PROCURADOR OU REPRESENTANTE LEGAL, O CADASTRO DO MESMO DEVE SER ATUALIZADO. ELE DEVE SER VINCULADO NO MENU RELACIONAMENTOS DE PODERES, NA ABA PARCEIRO DE NEGÓCIO E PRODUTOS BANCOOB, NO CADASTRO DO BENEFICIÁRIO/TOMADOR DO EMPRÉSTIMO. \n"	
			+"\n INFORMAÇÕES E DOCUMENTOS DO PROCURADOR/REP. LEGAL (se houver)"
			+"\n a)	NOME:"
			+"\n b)	CPF:"
			+"\n c)	TELEFONE DE CONTATO:" 
			+"\n d)	E-MAIL (se possuir):"
			+"\n e)	DOCUMENTO PESSOAL:"
			+"\n f)	RESIDÊNCIA ATUALIZADA (90 dias): "
			+"\n g)	RENDA ATUALIZADA (90 dias):"
			+"\n h)	AUTORIZAÇÃO/ALVARÁ JUDICIAL:"
			+"\n i)	PROCURAÇÃO PÚBLICA COM ASSINATURA A ROGO (somente em casos de tomadores analfabetos representados por terceiros):").apply();

		}
		else		
		if(categoria == "Conta Capital" && subcategoria == "Campanha de Capitalização 2022"){

			Form.fields("DESCRICAO").value
			("INFORMAÇÕES OBRIGATÓRIAS \n"
			+"\n a) Valor TOTAL da capitalização: "
			+"\n b) Conta corrente para débito: "
			+"\n c) Dia do débito: "
			+"\n d) Número de parcelas: ").apply();

		}		

	}	
	else
	if(modelo == "99_cons_consig"){

		if(subcategoria == "Mudança de Domicílio Bancário"){

			Form.fields("DESCRICAO").value
			("ORIENTAÇÕES PARA PREENCHIMENTO DO CHAMADO"
			+"\nJUNTO COM O FORMULÁRIO, ANEXAR DEMONSTRATIVO DE BENEFÍCO PARA CONFERÊNCIA DE DADOS.\n"
			+"\nNo formulário 30059 (anexo a este chamado), selecionar a opção: Solicitar troca de domicílio bancário – Na opção para quem é o Serviço: Posto de Atendimento (PA) – Após a formulário carregar, em Dados da Cooperativa Singular preencher: Central: 1005 – N° e Sigla Singular: 3084 – Sicoob Crediplanalto SC/RS – Dados do Posto de Atendimento (PA) Sigla: N° e Nome PA - Código do órgão pagador (informação disponível no arquivo relação de órgãos pagadores, em anexo neste chamado no caminho: no canto direito, nos três pontos clicar em informação, após isso em Baixar Arquivo de Ajuda), -  UF (Estado do PA) -  Cidade (Cidade do PA)  – Nome do responsável pelo atendimento (nome do atendente) – Carimbo e Assinatura do Responsável ( Assinatura e Carimbo do Atendente responsável por aquele atendimento)."
			+"\nDados  do Benefício: Responsável pela solicitação: Selecionar se Beneficiário ou Procurador:"
			+"\nSe beneficiário informar: nome do beneficiário – n° do benefício – N° NIT (localizado no demonstrativo de benefício do cliente);"
			+"\nSe procurador informar: nome do beneficiário – nome do procurador - n° do benefício – N° NIT (localizado no demonstrativo de benefício do cliente);"
			+"\nEm opções, selecionar entre: Transferência de benefício entre cooperativas (caso em que os beneficiários já recebem em contas do sistema Sicoob, porém em outras cooperativas);"
			+"\nTransferência de benefício de outra instituição financeira para a cooperativa (nos casos que os beneficiários recebem em outra instituição);"
			+"\nN° da nova conta corrente (conta corrente de titularidade do beneficiário, não podendo ser conta poupança, jurídica);"
			+"\nAssinatura do beneficiário ou procurador (assinatura conforme documento pessoal do cliente."
			+"\nLembrando que o procurador somente poderá solicitar a mudança de domicílio para o beneficiário se o mesmo estiver cadastrado no INSS, mediante autorização judicial e demais formalidades.").apply();
			
		}
		else
		if(subcategoria == "Prova de Vida"){

			Form.fields("DESCRICAO").value
			("ORIENTAÇÕES PARA PREENCHIMENTO DO CHAMADO \n"
			+"\n a) Para regularização dos benefícios bloqueados, realizar prova de vida;"
			+"\n b) Para crédito bloqueados como EVENTUAL, orientar o beneficiário a procurar um posto do INSS ou entrar em contato com o órgão pelo fone  135").apply();
			
		}
		else		
		if(subcategoria == "Comprovante de Entrega de Cartão / Senha"){

			Form.fields("DESCRICAO").value
			("ORIENTAÇÕES PARA PREENCHIMENTO DO CHAMADO \n"
			+"\n a) Encaminhado no dia ___ / ___ / ___ o cartão / carta senha dos beneficiários relacionados abaixo, juntamente com os formulários de recebimento, os quais deverão ser preenchidos pelo PA: Em sigla do PA – Nome do PA; em n° do PA – Número do PA ; Data de entrega – Nome do Responsável pela Entrega do Cartão – Posterior a isso, assinatura do responsável e carimbo do mesmo;"
			+"\n b) Dados  do Benefício: Responsável pela solicitação: Selecionar se Beneficiário ou Procurador:"
			+"\n c) Se beneficiário informar: nome do beneficiário – n° do benefício – N° NIT (localizado no demonstrativo de benefício do cliente);"
			+"\n d) Se procurador informar: nome do beneficiário – nome do procurador - n° do benefício – N° NIT (localizado no demonstrativo de benefício do cliente);"
			+"\n e) Assinatura do beneficiário ou procurador (assinatura conforme documento pessoal do cliente."
			+"\n Lembrando que o procurador somente poderá solicitar a mudança de domicílio para o beneficiário se o mesmo estiver cadastrado no INSS, mediante autorização judicial e demais formalidades.").apply();

		}
		else		
		if(subcategoria == "Previdência Colaboradores"){

			Form.fields("DESCRICAO").value
			("ORIENTAÇÕES PARA PREENCHIMENTO DO CHAMADO \n"
			+"\n a) N° conta corrente para cadastro na proposta: \n"
			+"\n b) Idade atual: \n"
			+"\n c) Com quantos anos você pretende começar a receber a sua renda, ou por quantos anos deseja contribuir com seu plano de previdência? \n"
			+"\n d) Deseja informar beneficiários: Se sim, detalhar nome, idade, sexo, CPF, o % que será direcionado a cada beneficiário e o grau de parentesco (filho, cônjuge e etc.); \n"
			+"\n e) Valor da contribuição (mínimo 1% do salário base para ter direito ao benefício da cooperativa): \n"
			+"\n f) Possui valores acumulados para iniciar seu plano, além da contribuição mensal? Se sim, detalhar o valor; \n"
			+"\n g) Valor da contribuição (mínimo 1% do salário base para ter direito ao benefício da cooperativa): \n"
			+"\n h) Deseja coberturas de risco (risco por morte mínimo de contribuição R$26,00 reais e/ou invalidez mínimo de R$ 16,00 reais -- contratando cobertura de risco, a taxa de carregamento será isenta; os valores de contribuição de risco, são somadas ao valor da contribuição mensal - Contribuição mensal + contribuição risco = desconto total -- os valores de contribuição mensal e consequente cobertura podem ser alterados, respeitando os mínimos informados;)? \n"
			+"\n i) Na simulação a renda por prazo determinado com no mínimo 10 anos, deseja simular o recebimento em quantos anos? \n"
			+"\n j) Deseja receber um % do saldo em parcela única, limitado a  20%? Se sim, qual % ? \n"
			+"\n k) Perfil de investimento (Conservador, Moderado ou Arrojado): \n"
			+"\n l) Tabela de tributação (Progressiva ou Regressiva): \n"
			+"\n OBSERVAÇÃO - Necessário API preenchido e atualizado no APP Sicoob, bem como cadastro atualizado").apply();

		}				

	}	

}