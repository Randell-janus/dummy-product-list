import { useEffect, useState } from "react";
import { Button, Input, Spinner } from "@material-tailwind/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  fetchProducts,
  getCartItems,
  Product,
  removeFromCart,
  searchProducts,
} from "./utils/api";
import { useDebounce } from "./utils/hooks";
import ProductCard from "./components/ProductCard";
import Modal from "./components/reusables/Modal";
import Menu from "./components/reusables/Menu";

function App() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  const navigate = useNavigate();
  const { pageNumber } = useParams<{ pageNumber: string }>();
  const page = pageNumber || 1;
  const productsPerPage = 10;
  const skip = (+page - 1) * productsPerPage;

  const handleRedirectToHome = () => navigate("/", { replace: true });

  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const onClearSearchClick = () => {
    setSearchText("");
    handleRedirectToHome();
  };
  const onNextPageClick = () => navigate(`/page/${+page + 1}`);
  const onPrevPageClick = () => navigate(`/page/${+page - 1}`);

  const {
    data: products,
    isPending,
    isError,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(productsPerPage, skip),
    placeholderData: keepPreviousData,
    staleTime: 10000,
    enabled: !debouncedSearchText,
  });

  const { data: searchResults, isPending: isPendingSearchResults } = useQuery<
    Product[]
  >({
    queryKey: ["searchResults", debouncedSearchText, page],
    queryFn: () => searchProducts(debouncedSearchText, productsPerPage, skip),
    enabled: !!debouncedSearchText,
  });

  const displayProducts = searchText ? searchResults : products;
  const isLastPage =
    displayProducts && displayProducts?.length < productsPerPage;

  useEffect(() => {
    if (page == 1 || (searchResults && displayProducts?.length === 0)) {
      handleRedirectToHome();
    }
  }, [page, displayProducts]);

  // redirect on searchText
  useEffect(() => {
    if (debouncedSearchText) {
      handleRedirectToHome();
    }
  }, [debouncedSearchText]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setCartItems(getCartItems());
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    setCartItems(getCartItems());
  };

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  if (isError) return <p>Error fetching products</p>;

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-24 space-y-8">
      {/* NAVIGATION */}
      <nav className="font-bold flex justify-between items-end py-4 border-b border-gray-400">
        <h1 className="text-4xl">Products Demo</h1>
        {/* CART ITEMS */}
        <Menu
          buttonTrigger={
            <button className="flex items-center gap-2">
              CHECK CART
              <span className="material-symbols-outlined font-bold">
                shopping_cart
              </span>
            </button>
          }
        >
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <div className="max-w-xl" key={product.id}>
                <ProductCard
                  product={product}
                  imageClassName="h-4/5 w-4/5"
                  showDescription={false}
                  onRemoveFromCart={() => handleRemoveFromCart(product.id)}
                />
              </div>
            ))
          ) : (
            <div>NO ITEMS IN CART</div>
          )}
        </Menu>
      </nav>

      {/* SEARCH BAR */}
      <div className="relative flex">
        <Input
          label="Search product"
          color="blue"
          value={searchText}
          onChange={onSearchTextChange}
        />
        {searchText && (
          <button
            className="!absolute right-2 top-2"
            onClick={onClearSearchClick}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
      {debouncedSearchText && isPendingSearchResults && (
        <div> searching...</div>
      )}

      {/* PRODUCT LIST & MODAL */}
      {isPending || (debouncedSearchText && isPendingSearchResults) ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Spinner className="h-16 w-16" />
        </div>
      ) : displayProducts && displayProducts.length > 0 ? (
        <div className="border border-gray-300">
          <div className="flex justify-center text-start border-b bg-gray-200 font-bold">
            <h3 className="hidden sm:flex sm:w-[210px] shrink-0 p-8">
              Thumbnail
            </h3>
            <h3 className="w-full hidden sm:flex py-8">Name</h3>
            <h3 className="w-[115px] shrink-0 hidden md:flex py-8">Price</h3>
          </div>
          {displayProducts?.map((product) => (
            <Modal
              key={product.id}
              buttonTrigger={<ProductCard product={product} />}
            >
              {/* MODAL CONTENT */}
              <div className="text-gray-700 space-y-4">
                <div>
                  <p className="uppercase">{product.category}</p>
                  <h4 className="text-3xl font-semibold text-black">
                    {product.title}
                  </h4>
                </div>
                <p className="font-medium">{product.description}</p>
                <p className="font-semibold text-black">₱ {product.price}</p>
                <div className="bg-gray-100 rounded p-4">
                  <p className="font-semibold">MORE IMAGES</p>
                  <div className="flex flex-col md:flex-row justify-evenly items-center">
                    {product.images.length > 0
                      ? product.images
                          .slice(0, 4)
                          .map((image, index) => (
                            <img
                              key={`${product.id}_${index}`}
                              src={image}
                              alt={product.title}
                              className="w-[100px] sm:w-[150px]"
                            />
                          ))
                      : "NO AVAILABLE IMAGES"}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center w-full md:w-auto justify-center"
                  >
                    Add to Cart
                    <span className="ml-2 material-symbols-outlined">
                      shopping_cart
                    </span>
                  </Button>
                </div>
              </div>
            </Modal>
          ))}
        </div>
      ) : (
        <div className="border flex items-center justify-center h-[50vh]">
          NO RESULTS FOUND
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center gap-6 justify-end">
        <button
          onClick={onPrevPageClick}
          disabled={+page === 1}
          className={`rounded-full px-4 py-3 border ${
            +page === 1 ? "text-gray-400" : ""
          }`}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span>
          Page <span className="font-bold">{page}</span>
        </span>
        <button
          onClick={onNextPageClick}
          disabled={isFetching || isLastPage}
          className={`rounded-full px-4 py-3 border ${
            isFetching || isLastPage ? "text-gray-200" : ""
          }`}
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default App;
