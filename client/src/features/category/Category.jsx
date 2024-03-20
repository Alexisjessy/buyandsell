import Loader from '../../components/Loader'
import { Link } from "react-router-dom"


export default function Category (props) {
    const category = props.category
    
    return (
        <section className="category">
            <img src={ "/" + category.image } alt={ category.title } />
            <h2>
                <span>{ category.title }</span>
            </h2>
            <p className="clear">{ category.description }</p>
            <section className="listing-product">
                { 
                    category.teas.map((tea) => {
                        return (
                            <article key={ tea.id }>
                                <h3>{ tea.title }</h3>
                                <img src={ "/" + tea.image } alt={ tea.title } />
                                <section className="price">
                                    <p>
                                        À partir de <strong>{ tea.price }€</strong>
                                    </p>
                                </section>
                                <Link className="btn" to={ `/the/${tea.id}` }>
                                    Voir ce produit
                                </Link>
                            </article>
                        )
                    })
                }
            </section>
        </section>
    )
}