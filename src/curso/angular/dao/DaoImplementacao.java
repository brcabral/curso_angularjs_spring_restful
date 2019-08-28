package curso.angular.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import curso.angular.hibernate.HibernateUtil;

@Service
@Transactional(noRollbackFor = Exception.class)
public abstract class DaoImplementacao<T> implements DaoInterface<T> {
	private Class<T> persistenceClass;
	private SessionFactory sessionFactory = HibernateUtil.getSessionFactory();

	public DaoImplementacao(Class<T> persistenceClass) {
		super();
		this.persistenceClass = persistenceClass;
	}

	@Override
	public void salvar(T objeto) throws Exception {
		sessionFactory.getCurrentSession().save(objeto);
		sessionFactory.getCurrentSession().flush();
	}

	@Override
	public void deletar(T objeto) throws Exception {
		sessionFactory.getCurrentSession().delete(objeto);
		sessionFactory.getCurrentSession().flush();
	}

	@Override
	public void atualizar(T objeto) throws Exception {
		sessionFactory.getCurrentSession().update(objeto);
		sessionFactory.getCurrentSession().flush();
	}

	@Override
	public void salvarOuAtualizar(T objeto) throws Exception {
		sessionFactory.getCurrentSession().saveOrUpdate(objeto);
		sessionFactory.getCurrentSession().flush();
	}

	@Override
	@SuppressWarnings("unchecked")
	public T merge(T objeto) throws Exception {
		T t = (T) sessionFactory.getCurrentSession().merge(objeto);
		sessionFactory.getCurrentSession().flush();
		return t;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> lista() throws Exception {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(persistenceClass);
		criteria.addOrder(Order.asc("id"));
		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> lista(String ids) throws Exception {
		List<Long> idList = new ArrayList<Long>();
		String[] strId = ids.split(",");

		for (int i = 0; i < strId.length; i++) {
			idList.add(Long.parseLong(strId[i]));
		}

		Criteria criteria = getSessionFactory().getCurrentSession().createCriteria(getPersistenceClass());
		criteria.add(Restrictions.in("id", idList));
		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> lista(String campoBanco, String valorCampo) throws Exception {
		Criteria criteria = getSessionFactory().getCurrentSession().createCriteria(getPersistenceClass());
		criteria.add(Restrictions.ilike(campoBanco, valorCampo + "%"));
		criteria.addOrder(Order.asc("id"));
		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> lista(String campoBanco, Long valorCampo) throws Exception {
		Criteria criteria = getSessionFactory().getCurrentSession().createCriteria(getPersistenceClass());
		criteria.add(Restrictions.eq(campoBanco, valorCampo));
		criteria.addOrder(Order.desc("id"));
		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public T loadObjeto(Long codigo) throws Exception {
		return (T) sessionFactory.getCurrentSession().get(persistenceClass, codigo);
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public Class<T> getPersistenceClass() {
		return persistenceClass;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> consultaPaginada(String numeroPagina) throws Exception {
		int totalPorPagina = 6;
		if ((numeroPagina == null) || ((numeroPagina != null && numeroPagina.trim().isEmpty()))) {
			numeroPagina = "0";
		}

		int offSet = ((Integer.parseInt(numeroPagina) * totalPorPagina) - totalPorPagina);
		if (offSet < 0) {
			offSet = 0;
		}

		Criteria criteria = getSessionFactory().getCurrentSession().createCriteria(getPersistenceClass());
		criteria.setFirstResult(offSet);
		criteria.setMaxResults(totalPorPagina);
		criteria.addOrder(Order.asc("id"));

		return criteria.list();
	}

	@SuppressWarnings("deprecation")
	public int quantidadePagina() throws Exception {
		String sql = "select count(1) as totalRegistros FROM " + getPersistenceClass().getSimpleName();
		int quantidadePagina = 1;
		double totalPorPagina = 6.0;
		SQLQuery find = getSessionFactory().getCurrentSession().createSQLQuery(sql);
		Object resultSet = find.uniqueResult();
		if (resultSet != null) {
			double totalRegistros = Double.parseDouble(resultSet.toString());
			if (totalRegistros > totalPorPagina) {

				double quantidadePaginaTemp = Float.parseFloat("" + (totalRegistros / totalPorPagina));

				if (!(quantidadePaginaTemp % 2 == 0)) {
					quantidadePagina = new Double(quantidadePaginaTemp).intValue() + 1;
				} else {
					quantidadePagina = new Double(quantidadePaginaTemp).intValue();
				}
			} else {
				quantidadePagina = 1;
			}
		}
		return quantidadePagina;
	}
}
