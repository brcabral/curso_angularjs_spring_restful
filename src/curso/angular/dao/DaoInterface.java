package curso.angular.dao;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(noRollbackFor = Exception.class)
public interface DaoInterface<T> {
	void salvar(T objeto) throws Exception;

	void deletar(T objeto) throws Exception;

	void atualizar(T objeto) throws Exception;

	void salvarOuAtualizar(T objeto) throws Exception;

	T merge(T objeto) throws Exception;

	List<T> lista() throws Exception;

	List<T> lista(String ids) throws Exception;

	List<T> lista(String campoBanco, String valorCampo) throws Exception;
	
	List<T> lista(String campoBanco, Long valorCampo) throws Exception;

	T loadObjeto(Long codigo) throws Exception;

	List<T> consultaPaginada(String numeroPagina) throws Exception;

	int quantidadePagina() throws Exception;
}
