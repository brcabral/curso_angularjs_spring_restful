package curso.angular.controller;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import curso.angular.dao.DaoImplementacao;
import curso.angular.dao.DaoInterface;
import curso.angular.model.Cidades;

@Controller
@RequestMapping(value = "/cidades")
public class CidadesController extends DaoImplementacao<Cidades> implements DaoInterface<Cidades> {
	public CidadesController(Class<Cidades> persistenceClass) {
		super(persistenceClass);
	}

	@ResponseBody
	@RequestMapping(value = "listar/{idEstado}", method = RequestMethod.GET, headers = "Accept=application/json")
	public String listar(@PathVariable("idEstado") String idEstado) throws Exception {
		return new Gson().toJson(lista(Long.parseLong(idEstado)));
	}

	@SuppressWarnings("unchecked")
	private List<Cidades> lista(long codigoEstado) throws Exception {
		Criteria criteria = getSessionFactory().getCurrentSession().createCriteria(getPersistenceClass());
		criteria.add(Restrictions.eq("estados.id", codigoEstado));
		return criteria.list();
	}

	@ResponseBody
	@RequestMapping(value = "listarchrome", method = RequestMethod.GET)
	private String listarChrome(@RequestParam("idEstado") String idEstado) throws Exception {
		return new Gson().toJson(lista(Long.parseLong(idEstado)));
	}
}
