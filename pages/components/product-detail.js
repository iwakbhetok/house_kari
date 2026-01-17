import { useEffect, useState } from 'react';

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/product-detail/${productId}`);
                const data = await response.json();
                setProduct(data.data);
            } catch (error) {
                console.error('Fetch product error:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <img src={`https://prahwa.net/${product.image}`} alt={product.name} />
            <p>Category: {product.category.name}</p>
            <p>E-commerce Links: {product.ecommerce_links}</p>
        </div>
    );
};

export default ProductDetails;
