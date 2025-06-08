import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import { fetchCategories, updatePreferences } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  isSelected?: boolean;
}

const Interests = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const loadCategories = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchCategories(page);
      setCategories(
        data.categories.map((cat: Category) => ({
          ...cat,
          isSelected: selectedCategories.includes(cat.id),
        }))
      );
      setTotalPages(data.totalPages);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    let updated;
    if (selectedCategories.includes(categoryId)) {
      updated = selectedCategories.filter((id) => id !== categoryId);
    } else {
      updated = [...selectedCategories, categoryId];
    }
    setSelectedCategories(updated);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isSelected: !cat.isSelected } : cat
      )
    );
    updatePreferences(updated).catch(() => {});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 text-sm ${currentPage === i ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-2 text-sm ${currentPage === i ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
            >
              {i}
            </button>
          );
        }
        buttons.push(<span key="ellipsis1" className="px-2 text-gray-400">...</span>);
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-black"
          >
            {totalPages}
          </button>
        );
      } else if (currentPage >= totalPages - 3) {
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-black"
          >
            1
          </button>
        );
        buttons.push(<span key="ellipsis2" className="px-2 text-gray-400">...</span>);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-2 text-sm ${currentPage === i ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
            >
              {i}
            </button>
          );
        }
      } else {
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-black"
          >
            1
          </button>
        );
        buttons.push(<span key="ellipsis3" className="px-2 text-gray-400">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-2 text-sm ${currentPage === i ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
            >
              {i}
            </button>
          );
        }
        buttons.push(<span key="ellipsis4" className="px-2 text-gray-400">...</span>);
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-black"
          >
            {totalPages}
          </button>
        );
      }
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-black mb-4">Please mark your interests!</h2>
              <p className="text-gray-600">We will keep you notified.</p>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-6">My saved interests!</h3>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={String(category.id)}
                      checked={!!category.isSelected}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <label
                      htmlFor={String(category.id)}
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
              >
                &lt;
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
              >
                &gt;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interests;
