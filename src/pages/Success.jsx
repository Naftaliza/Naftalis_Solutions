import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Success = () => {
  return (
    <>
      <Helmet>
        <title>Payment Successful!</title>
        <meta name="description" content="Your order has been placed successfully." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center"
      >
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-500 flex items-center justify-center"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your order has been placed successfully. We've sent a confirmation email with your order details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/store">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 text-base">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 py-3 px-6 text-base">
                Back to Budget
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Success;