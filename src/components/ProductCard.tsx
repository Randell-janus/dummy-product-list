import { Product } from "../utils/api";

type ProductCardProps = {
  product: Product;
  imageClassName?: string;
  showDescription?: boolean;
  onRemoveFromCart?: (id: number) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  imageClassName,
  showDescription = true,
  onRemoveFromCart,
}) => {
  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-x-8">
        <div
          className={`flex items-center justify-center shrink-0 m-auto ${imageClassName}`}
        >
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
            {showDescription && <p>{product.description}</p>}
          </div>
          <div className="min-w-[100px] my-auto">
            {product.quantity ? (
              <p className="flex items-center">
                qty:{" "}
                <span className="font-semibold text-xl">
                  {product.quantity}
                </span>
                {onRemoveFromCart && (
                  <button
                    onClick={() => onRemoveFromCart(product.id)}
                    className="ml-6 text-red-600"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </p>
            ) : (
              <p>
                <span className="font-bold mr-2">₱</span>
                {product.price}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
