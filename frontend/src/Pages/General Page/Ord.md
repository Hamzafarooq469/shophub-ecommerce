
import { useSelector } from "react-redux";
import axios from "axios";

const Ord = () => {
    const user = useSelector((state) => state.user.currentUser);
    // console.log(user);

    const handleOrder = async () => {
        try {
            // Get cart and shipping info
            // const cartResponse = await axios.get(`/cart/getCart/${user.uid}`);
            const shippingResponse = await axios.get(`/shipping/getShippingInfo/${user.uid}`);

            // const orderData = {
            //     userId: user.uid,
            //     cartItems: cartResponse.data.cartItems,
            //     shippingId: shippingResponse.data.shipping._id,  // Using shipping ID to simplify backend lookup
            // };  

            const orderData = {
                user: user?.uid,
                // products: cartResponse.data.cartItems.map(item => ({
                //     productId: item.product._id,
                //     quantity: item.quantity,
                // })),
                shippingId: shippingResponse.data.shipping._id
            };
            

            const res = await axios.post("/order/createOrder", orderData);
            console.log("Order Created:", res.data);
        } catch (error) {
            console.log("Order Creation Error:", error);
        }
    };

    return (
        <div>
            <h1> Orders - Here </h1>
            <button onClick={handleOrder}> Place Order </button>
        </div>
    );
};

export default Ord;
