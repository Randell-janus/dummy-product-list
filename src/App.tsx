import { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProducts, Product, searchProducts } from "./utils/api";
import { useDebounce } from "./utils/hooks";

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

  // useDebounce(() => searchProducts(searchText), [searchText], 500);

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

  // this effect does not redirect
  // if has searchText, will see emptypage when if no results on the current page number
  // useEffect(() => {
  //   if (page == 1) {
  //     navigate("/", { replace: true });
  //   }
  // }, [page]);

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

      {/* PRODUCTS */}
      <ul>
        {displayProducts?.map((product) => (
          <li
            key={product.id}
            className="border-x first:border-t last:border-b border-gray-300 p-4"
          >
            <div className="flex flex-col sm:flex-row gap-x-8">
              <div className="flex size-40 items-center justify-center shrink-0 m-auto">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-full"
                />
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
          </li>
        ))}
      </ul>

      {/* FOOTER */}
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
