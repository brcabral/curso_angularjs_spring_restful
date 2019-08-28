// configurações do controller de livro
app.controller("livroController", function($scope, $http, $location, $routeParams) {	
	$scope.livro = {};
	
	$scope.salvarLivro = function() {
		$scope.livro.foto = document.getElementById("imagemLivro").getAttribute("src");		
		
		$http.post("livro/salvar", $scope.livro).success(function(response) {
			$scope.livro = {};
			document.getElementById("imagemLivro").src = '';
			sucesso("Livro salvo com sucesso!");
		}).error(function(data, status, headers, config) {
			erro("Erro ao salvar livro! \n Erro: " + response);
		});
	};
	
	if ($routeParams.id != null && $routeParams.id != '' && $routeParams.id != undefined) {
		$http.get("livro/buscarlivro/" + $routeParams.id).success(function(response) {
			$scope.livro = response;
			
			document.getElementById("imagemLivro").src = $scope.livro.foto;
			// ---------- carregar fornecedor do livro ----------
			setTimeout(function() {
				$http.get("fornecedor/listartodos/").success(function(response) {
					$scope.fornecedores = response;
					setTimeout(function() {
						$("#selectFornecedores").prop('selectedIndex', buscarKeyJson(response, 'id', $scope.livro.fornecedor.id));
					}, 1000);
				}).error(function(data, status, headers, config) {
					erro("Erro as cidades! \n Erro: " + response);
				});

			}, 1000);
			// ---------------------------------------------------------
		}).error(function(data, status, headers, config) {
			erro("Erro ao pesquisar livro! \n Erro: " + response);
		});
	} else {
		$scope.livro = {};
	}
	
	$scope.editarLivro = function(id) {
		$location.path("livroedit/" + id);
	};

	$scope.removerLivro = function(codLivro) {
		$http.delete("livro/deletar/" + codLivro).success(function(response) {
			$scope.listarLivros($scope.numeroPagina);
			sucesso("Livro removido com sucesso!");
		}).error(function(data, status, headers, config) {
			erro("Erro ao remover livro! \n Erro: " + response);
		});
	};
	
	$scope.listarLivros = function(numeroPagina) {
		$scope.numeroPagina = numeroPagina;
		$http.get("livro/listar/" + numeroPagina).success(function(response) {
			$scope.data = response;

			// ------------ Início total página ------------
			$http.get("livro/totalPagina").success(function(response) {
				$scope.totalPagina = response;
			}).error(function(response) {
				erro("Erro ao verificar a quantidade de páginas! \n Erro: " + response);
			});
			// ------------ Fim total página ------------
		}).error(function(response) {
			erro("Erro ao listar os livros! \n Erro: " + response);
		});
	};
	
	$scope.anterior = function() {
		if (new Number($scope.numeroPagina) > 1) {
			$scope.listarLivros(new Number($scope.numeroPagina - 1));
		}
	};
	
	$scope.proximo = function() {
		if (new Number($scope.numeroPagina) < new Number($scope.totalPagina)) {
			$scope.listarLivros(new Number($scope.numeroPagina + 1));
		}
	};

	$scope.carregarFornecedores = function() {
		$scope.fornecedores = [{}];
		$http.get("fornecedor/listartodos").success(function(response) {
			$scope.fornecedores = response;
		}).error(function(response) {
			erro("Erro ao listar os fornecedores! \n Erro: " + response);
		});
	};
});