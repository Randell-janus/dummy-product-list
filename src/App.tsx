import { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProducts, Product, searchProducts } from "./utils/api";
import { useDebounce } from "./utils/hooks";
import ProductCard from "./components/ProductCard";
import Modal from "./components/reusables/Modal";

function App() {
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
    error,
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

  if (isPending) return <p>Loading products...</p>;
  if (isError) return <p>Error fetching products</p>;

  return (
    <div className="max-w-screen-xl h-screen mx-auto px-8 py-24 space-y-8">
      {/* NAVIGATION */}
      <nav className="font-bold flex justify-between items-end py-4 border-b border-gray-400">
        <h1 className="text-4xl">Products Demo</h1>
        <button>
          <span className="material-symbols-outlined font-bold">
            shopping_cart
          </span>
        </button>
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
      {debouncedSearchText && isPendingSearchResults ? (
        <span> searching...</span>
      ) : null}

      {/* PRODUCT LIST & MODAL */}
      <div className="border border-gray-300">
        {displayProducts?.map((product) => (
          <Modal
            key={product.id}
            buttonTrigger={
              <ProductCard
                id={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                images={product.images}
              />
            }
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
            </div>
          </Modal>
        ))}
      </div>

      {/* PAGINATION FOOTER */}
      <div>
        <button onClick={onPrevPageClick} disabled={+page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={onNextPageClick} disabled={isFetching || isLastPage}>
          Next
        </button>
      </div>
      {isFetching ? <span> Loading...</span> : null}
    </div>
  );
}

export default App;
