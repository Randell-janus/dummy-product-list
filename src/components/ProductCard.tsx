import { Product } from "../utils/api";

const ProductCard: React.FC<Product> = (product) => {
  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-x-8">
        <div className="flex size-40 items-center justify-center shrink-0 m-auto">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full"
            />
          ) : (
            "NO IMAGE"
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full gap-8">
          <div className="space-y-2 my-auto">
            <div className="font-semibold">{product.title}</div>
            <p>{product.description}</p>
          </div>
          <p className="min-w-[100px] my-auto">
            <span className="font-bold mr-2">₱</span>
            {product.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
