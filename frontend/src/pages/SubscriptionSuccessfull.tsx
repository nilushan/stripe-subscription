import { useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';

const PaymentSuccessful = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        // You can add any additional logic here, such as fetching the payment details from your backend.
    }, []);



    return (
        <Container className="my-4">

            <Row>
                <Col>
                    <Alert variant="success">
                        <Alert.Heading>Payment Successful!</Alert.Heading>
                        <p>
                            Thank you for your payment. Your transaction has been processed successfully.
                        </p>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentSuccessful;