'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Demo paintings data
const demoPaintings = [
  {
    id: 'painting-1',
    name: 'Tropical Banana Leaf Wall Painting',
    description: 'Living Room, Bedroom, Hotels - Big Style frame 50 inch x 30 inch Wall Art',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    category: 'Nature',
    rating: 4.4,
    reviews: 96,
    soldLastMonth: 50,
    price: 2299,
    originalPrice: 4999,
    discount: 54,
    isPrime: true,
  },
  {
    id: 'painting-2',
    name: 'Vintage Courtyard Garden - Luxury HD Canvas Print',
    description: 'Golden Framed & Ready to Hang - Large Painting for Living Room',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    category: 'Garden',
    rating: 4.8,
    reviews: 71,
    soldLastMonth: 100,
    price: 6995,
    originalPrice: 9995,
    discount: 30,
    isPrime: true,
    isBestSeller: true,
  },
  {
    id: 'painting-3',
    name: 'Beautiful Deer Modern Art Premium Sparkle Lamination',
    description: 'Finished Surface Golden Slim Frame 122 cm x 41 cm Large Size',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    category: 'Wildlife',
    rating: 4.0,
    reviews: 11,
    soldLastMonth: 25,
    price: 1899,
    originalPrice: 3999,
    discount: 53,
    isPrime: true,
    isLimitedDeal: true,
  },
  {
    id: 'painting-4',
    name: 'City View Wall Paintings with Frame',
    description: 'Home Decoration - Painting for Living Room Bedroom Office Wall',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
    category: 'Urban',
    rating: 4.6,
    reviews: 1358,
    soldLastMonth: 200,
    price: 1499,
    originalPrice: 3999,
    discount: 63,
    isPrime: true,
  },
  {
    id: 'painting-5',
    name: 'Abstract Modern Art Canvas Print',
    description: 'Contemporary Design with Vibrant Colors - Ideal for Office',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    category: 'Abstract',
    rating: 4.7,
    reviews: 234,
    soldLastMonth: 75,
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    isPrime: true,
  },
  {
    id: 'painting-6',
    name: 'Serene Mountain Landscape Canvas',
    description: 'Breathtaking Mountain View - Brings Peace and Tranquility',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    category: 'Landscape',
    rating: 4.9,
    reviews: 456,
    soldLastMonth: 150,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    isPrime: true,
    isBestSeller: true,
  },
  {
    id: 'painting-7',
    name: 'Classic Floral Arrangement Art',
    description: 'Elegant Floral Canvas Print - Timeless Beauty',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    category: 'Floral',
    rating: 4.5,
    reviews: 189,
    soldLastMonth: 80,
    price: 2799,
    originalPrice: 4499,
    discount: 38,
    isPrime: true,
  },
  {
    id: 'painting-8',
    name: 'Ocean Sunset View Premium Canvas',
    description: 'Stunning Ocean Sunset - Perfect for Bedroom',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    category: 'Nature',
    rating: 4.8,
    reviews: 312,
    soldLastMonth: 120,
    price: 3999,
    originalPrice: 6499,
    discount: 38,
    isPrime: true,
  },
];

// Categories for filter
const categories = ['All', 'Nature', 'Abstract', 'Landscape', 'Floral', 'Urban', 'Garden', 'Wildlife'];

// Frame materials for filter
const frameMaterials = ['All', 'Wood', 'Metal', 'Acrylic', 'Engineered Wood', 'Maple Wood'];

export default function PaintingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const filteredPaintings = demoPaintings.filter(painting => {
    if (selectedCategory !== 'All' && painting.category !== selectedCategory) return false;
    return true;
  });

  const handlePaintingClick = (paintingId: string) => {
    router.push(`/paintings/${paintingId}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        // Store uploaded image and navigate to detail page
        localStorage.setItem('customUploadImage', imageData);
        localStorage.setItem('customUploadFileName', file.name);
        router.push('/paintings/custom-upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-blue-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Paintings</h1>
              <p className="text-sm text-gray-500">
                {filteredPaintings.length} results
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 md:hidden"
            >
              <FilterListIcon className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg p-4 shadow-sm sticky top-20">
              {/* Upload Custom Option */}
              <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-center"
                >
                  <CloudUploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Upload Your Image</p>
                  <p className="text-xs text-gray-500 mt-1">Create custom painting</p>
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Theme</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame Material Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Frame Material</h3>
                <div className="space-y-2">
                  {frameMaterials.map((material) => (
                    <label key={material} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMaterial === material}
                        onChange={() => setSelectedMaterial(material)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Under ₹2,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">₹2,000 - ₹5,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">₹5,000 - ₹10,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Over ₹10,000</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Product Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Trending Now</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500">Sponsored</span>
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPaintings.map((painting) => (
                <div
                  key={painting.id}
                  onClick={() => handlePaintingClick(painting.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={painting.image}
                      alt={painting.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {painting.isBestSeller && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                        Best Seller
                      </span>
                    )}
                    {painting.isLimitedDeal && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Limited Time Deal
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-red-600 mb-1">
                      {painting.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                      {painting.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(painting.rating)}
                      <span className="text-xs text-gray-500">({painting.reviews})</span>
                    </div>

                    {/* Sold count */}
                    <p className="text-xs text-gray-500 mb-2">
                      {painting.soldLastMonth}+ bought in past month
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{painting.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{painting.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        ({painting.discount}% off)
                      </span>
                    </div>

                    {/* Prime & Delivery */}
                    {painting.isPrime && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                          prime
                        </span>
                        <span className="text-xs text-gray-600">FREE Delivery</span>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaintingClick(painting.id);
                      }}
                      className="w-full mt-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* More Results */}
            <div className="bg-white rounded-lg p-4 mt-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">More results</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                  Amazon&apos;s Choice
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm cursor-pointer hover:bg-orange-200">
                  Best Seller
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
