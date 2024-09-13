<div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {provider.products.map(product => (
                            <div key={product.id} className="group">
                                <div className="relative overflow-hidden rounded-lg">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-48 object-cover transition duration-300 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button 
                                            onClick={() => handlePhoneCall(provider.phoneNumber)}
                                            className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-100 transition duration-300"
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span>Call to Order</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-green-600 font-medium">{product.price}</p>
                                        {product.price2 && <p className="text-gray-500 text-sm">{product.price2}</p>}
                                        {product.price3 && <p className="text-gray-500 text-sm">{product.price3}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
       