import React, { useState, useEffect } from 'react';
import { BackendApi } from '../utils/Api';
import { ProductAndPrices } from '../../../shared/types';
import { Link } from 'react-router-dom';

const apis = new BackendApi();

const ProductsPage = () => {
    const [products, setProducts] = useState<ProductAndPrices[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            apis.getProductsAndPrices().then((data) => {
                setProducts(data.productsAndPrices);
            });
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Subscription Plans</h1>
            {products && products.length > 0 && products.map((product) => (
                <div key={product.product.id}>
                    <h2>{product.product.name}</h2>
                    <p>{product.product.description}</p>       
                    <ul>
                        {
                            product.prices.map((price) => (
                               <div key={'price_id_' + price.id}>
                                <Link to={`/subscribe/networkid/${price.id}`}> Subscribe for ${price.unit_amount / 100}/ {price.recurring.interval} 
                                   <button key={price.id}> Subscribe for ${price.unit_amount / 100}/ {price.recurring.interval}  </button> <br />
                                 </Link> 
                               </div>
                            ))
                        }
                    </ul>
                </div>
            ))}
        </div>
    );
};


export default ProductsPage;