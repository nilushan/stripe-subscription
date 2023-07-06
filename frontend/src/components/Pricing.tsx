import React, { useEffect, useMemo, useState } from 'react';
import './Pricing.css';
import { BackendApi } from '../utils/Api';
import { ProductAndPrices } from '../../../shared/types';

export interface IPriceTier {
    title: string,
    price: string,
    buttonText: string,
    description: string[],
}
export interface IPricingProps {
    tiers: IPriceTier[]
}
const Pricing = () => {

    const apis = useMemo(() => new BackendApi(), []);

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
            <div className="container">
                <h1 className="title">Pricing</h1>
                <p className="description">
                    Quickly build an effective pricing table for your potential customers with
                    this layout. It's built with default components with little customization.
                </p>
            </div>

            <div className="container large">
                {products.map((product) => (
                    <div className="card" key={product.product.id}>
                        <h2 className="card-title">{product.product.name}</h2>
                        <p className="card-subtitle">{product.product.description}</p>

                        {product.prices.map((price) =>
                        (
                            <div>
                                <h6 className="card-subtitle">{price.unit_amount} / {price.recurring.interval} </h6>
                                <button className="button">{ 'Subscribe' }</button>
                            </div>
                        )
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}


export default Pricing;