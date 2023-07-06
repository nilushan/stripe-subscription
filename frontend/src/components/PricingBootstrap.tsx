import React, { useEffect, useMemo, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { BackendApi } from '../utils/Api';
import { ProductAndPrices } from '../../../shared/types';
import { Link } from 'react-router-dom';

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
        <Container className="my-4">
            <Container className="text-center py-5">
                <h1 className="display-4">Pricing</h1>
                <p className="lead">
                    Quickly build an effective pricing table for your potential customers with
                    this layout. It's built with default React-Bootstrap components with little
                    customization.
                </p>
            </Container>
            <Row xs={1} md={2} lg={4} className="g-4">
                {products.map((product) => (
                    <Col key={product.product.id}>
                        <Card className="h-100">
                            <Card.Header className="text-center">
                                <Card.Title>{product.product.name}</Card.Title>
                                <Card.Subtitle>{product.product.description}</Card.Subtitle>
                            </Card.Header>
                            {product.prices.map((price) =>
                            (
                                <Card.Body>
                                    <Card.Title>${price.unit_amount / 100} / {price.recurring.interval}</Card.Title>
                                    <Link to={`/subscribe/networkid/${price.id}`}> 
                                        <Button className="w-100" variant="primary">{'Subscribe'}</Button>
                                    </Link>
                                </Card.Body>
                            )
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Pricing;
