'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Footer from '@/components/Footer';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Demo paintings data (same as listing page)
const demoPaintings: Record<string, any> = {
  'painting-1': {
    id: 'painting-1',
    name: 'Tropical Banana Leaf Wall Painting',
    fullName: 'LivinYluxe Set of 3 Tropical Banana Leaf Wall Painting for Living Room, Bedroom, Hotels - Big Style frame 50 inch x 30 inch Wall Art',
    description: 'Living Room, Bedroom, Hotels - Big Style frame 50 inch x 30 inch Wall Art',
    longDescription: 'Transform your living space with this stunning set of 3 tropical banana leaf wall paintings. Each piece features vibrant green hues and intricate leaf patterns that bring the beauty of nature indoors. Perfect for creating a relaxing, tropical atmosphere in any room.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
      'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=800&q=80',
    ],
    category: 'Nature',
    brand: 'LivinYluxe',
    rating: 4.4,
    reviews: 96,
    soldLastMonth: 50,
    price: 2299,
    originalPrice: 4999,
    discount: 54,
    isPrime: true,
    inStock: true,
    deliveryDate: 'Tuesday, 24 December',
  },
  'painting-2': {
    id: 'painting-2',
    name: 'Vintage Courtyard Garden - Luxury HD Canvas Print',
    fullName: 'PAPER PLANE DESIGN Vintage Courtyard Garden - Luxury HD Canvas Print with Golden Framed & Ready to Hang - Large Painting for Living Room, Office Wall Decor',
    description: 'Golden Framed & Ready to Hang - Large Painting for Living Room',
    longDescription: 'Experience the timeless beauty of a vintage courtyard garden with this luxury HD canvas print. Featuring a stunning golden frame and ready-to-hang design, this masterpiece brings elegance and sophistication to any living room or office space.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    ],
    category: 'Garden',
    brand: 'PAPER PLANE DESIGN',
    rating: 4.8,
    reviews: 71,
    soldLastMonth: 100,
    price: 6995,
    originalPrice: 9995,
    discount: 30,
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    deliveryDate: 'Tuesday, 30 December',
  },
  'painting-3': {
    id: 'painting-3',
    name: 'Beautiful Deer Modern Art Premium Sparkle Lamination',
    fullName: 'paintings Beautiful deer modern art Premium Sparkle Lamination Finished Surface Golden Slim Frame 122 cm x 41 cm Large Size',
    description: 'Finished Surface Golden Slim Frame 122 cm x 41 cm Large Size',
    longDescription: 'Add a touch of wildlife elegance to your home with this beautiful deer modern art piece. Features premium sparkle lamination and a golden slim frame for a sophisticated look.',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    ],
    category: 'Wildlife',
    brand: 'ArtDecor',
    rating: 4.0,
    reviews: 11,
    soldLastMonth: 25,
    price: 1899,
    originalPrice: 3999,
    discount: 53,
    isPrime: true,
    isLimitedDeal: true,
    inStock: true,
    deliveryDate: 'Wednesday, 25 December',
  },
  'painting-4': {
    id: 'painting-4',
    name: 'City View Wall Paintings with Frame',
    fullName: 'wallfare - City View wall Paintings with Frame for Home Decoration - Painting for Living Room Bedroom Office Wall hanging frames',
    description: 'Home Decoration - Painting for Living Room Bedroom Office Wall',
    longDescription: 'Bring the urban sophistication to your space with this stunning city view wall painting. Perfect for modern homes and offices, featuring a sleek frame that complements any decor style.',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
    ],
    category: 'Urban',
    brand: 'wallfare',
    rating: 4.6,
    reviews: 1358,
    soldLastMonth: 200,
    price: 1499,
    originalPrice: 3999,
    discount: 63,
    isPrime: true,
    inStock: true,
    deliveryDate: 'Monday, 23 December',
  },
  'painting-5': {
    id: 'painting-5',
    name: 'Abstract Modern Art Canvas Print',
    fullName: 'Abstract Modern Art Canvas Print - Contemporary Design with Vibrant Colors - Ideal for Office and Modern Spaces',
    description: 'Contemporary Design with Vibrant Colors - Ideal for Office',
    longDescription: 'Make a bold statement with this abstract modern art canvas print. Featuring vibrant colors and contemporary design, perfect for adding artistic flair to office spaces and modern interiors.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    ],
    category: 'Abstract',
    brand: 'ModernArt',
    rating: 4.7,
    reviews: 234,
    soldLastMonth: 75,
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    isPrime: true,
    inStock: true,
    deliveryDate: 'Thursday, 26 December',
  },
  'painting-6': {
    id: 'painting-6',
    name: 'Serene Mountain Landscape Canvas',
    fullName: 'Serene Mountain Landscape Canvas - Breathtaking Mountain View - Brings Peace and Tranquility to Any Room',
    description: 'Breathtaking Mountain View - Brings Peace and Tranquility',
    longDescription: 'Escape to the mountains with this breathtaking landscape canvas. The serene mountain view brings peace and tranquility to any room, making it perfect for bedrooms and meditation spaces.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    category: 'Landscape',
    brand: 'NatureArt',
    rating: 4.9,
    reviews: 456,
    soldLastMonth: 150,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    deliveryDate: 'Friday, 27 December',
  },
  'painting-7': {
    id: 'painting-7',
    name: 'Classic Floral Arrangement Art',
    fullName: 'Classic Floral Arrangement Art - Elegant Floral Canvas Print - Timeless Beauty for Traditional and Modern Homes',
    description: 'Elegant Floral Canvas Print - Timeless Beauty',
    longDescription: 'Add timeless elegance to your home with this classic floral arrangement art. The beautiful floral design complements both traditional and modern decor styles.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    ],
    category: 'Floral',
    brand: 'FloralArt',
    rating: 4.5,
    reviews: 189,
    soldLastMonth: 80,
    price: 2799,
    originalPrice: 4499,
    discount: 38,
    isPrime: true,
    inStock: true,
    deliveryDate: 'Saturday, 28 December',
  },
  'painting-8': {
    id: 'painting-8',
    name: 'Ocean Sunset View Premium Canvas',
    fullName: 'Ocean Sunset View Premium Canvas - Stunning Ocean Sunset - Perfect for Bedroom and Relaxation Spaces',
    description: 'Stunning Ocean Sunset - Perfect for Bedroom',
    longDescription: 'Relax with this stunning ocean sunset view premium canvas. The warm colors and peaceful scenery make it perfect for bedrooms and relaxation spaces.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    ],
    category: 'Nature',
    brand: 'OceanArt',
    rating: 4.8,
    reviews: 312,
    soldLastMonth: 120,
    price: 3999,
    originalPrice: 6499,
    discount: 38,
    isPrime: true,
    inStock: true,
    deliveryDate: 'Sunday, 29 December',
  },
};

// Size options
const sizeOptions = [
  { id: 'small', name: '1 Ft x 1.5 Ft', label: '(A)', priceMultiplier: 0.6 },
  { id: 'medium', name: '2 Ft x 3 Ft', label: '(B)', priceMultiplier: 1 },
  { id: 'large', name: '2 Ft x 4 Ft', label: '(D)', priceMultiplier: 1.4 },
  { id: 'xlarge', name: '3 Ft x 4 Ft', label: '(E)', priceMultiplier: 1.8 },
];

export default function PaintingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paintingId = params.id as string;

  const [painting, setPainting] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if it's a custom upload
    if (paintingId === 'custom-upload') {
      const customImage = localStorage.getItem('customUploadImage');
      const customFileName = localStorage.getItem('customUploadFileName');
      if (customImage) {
        setPainting({
          id: 'custom-upload',
          name: 'Your Custom Painting',
          fullName: `Custom Upload - ${customFileName || 'Your Image'}`,
          description: 'Your uploaded image converted to premium canvas painting',
          longDescription: 'Transform your precious memories or favorite artwork into a stunning canvas painting. We use premium HD printing technology to ensure vibrant colors and sharp details.',
          image: customImage,
          images: [customImage],
          category: 'Custom',
          brand: 'Custom Upload',
          rating: 5.0,
          reviews: 0,
          soldLastMonth: 0,
          price: 2999,
          originalPrice: 4999,
          discount: 40,
          isPrime: true,
          inStock: true,
          deliveryDate: 'Within 7-10 days',
          isCustom: true,
        });
      } else {
        router.push('/paintings');
      }
    } else {
      // Get painting from demo data
      const paintingData = demoPaintings[paintingId];
      if (paintingData) {
        setPainting(paintingData);
      } else {
        router.push('/paintings');
      }
    }
  }, [paintingId, router]);

  const handleAddToCart = () => {
    if (!painting) return;

    setLoading(true);

    const selectedSizeData = sizeOptions.find(s => s.id === selectedSize);
    const finalPrice = Math.round(painting.price * (selectedSizeData?.priceMultiplier || 1));

    // Store painting selection
    const paintingSelection = {
      type: painting.isCustom ? 'custom' : 'gallery',
      paintingId: painting.id,
      paintingName: painting.name,
      paintingImage: painting.image,
      size: {
        id: selectedSize,
        name: selectedSizeData?.name,
        label: selectedSizeData?.label,
      },
      quantity,
      price: finalPrice,
      originalPrice: Math.round(painting.originalPrice * (selectedSizeData?.priceMultiplier || 1)),
      timestamp: Date.now()
    };

    localStorage.setItem('paintingSelection', JSON.stringify(paintingSelection));

    // Navigate to product selection
    setTimeout(() => {
      router.push('/product-selection');
    }, 500);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (!painting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const selectedSizeData = sizeOptions.find(s => s.id === selectedSize);
  const finalPrice = Math.round(painting.price * (selectedSizeData?.priceMultiplier || 1));
  const finalOriginalPrice = Math.round(painting.originalPrice * (selectedSizeData?.priceMultiplier || 1));

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center text-sm text-gray-600">
            <button onClick={() => router.push('/paintings')} className="hover:text-red-600 flex items-center">
              <ArrowBackIcon className="w-4 h-4 mr-1" />
              Back to Paintings
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{painting.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 truncate max-w-xs">{painting.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={painting.images?.[selectedImage] || painting.image}
                alt={painting.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            {painting.images && painting.images.length > 1 && (
              <div className="flex gap-2">
                {painting.images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Click to see full view */}
            <p className="text-sm text-gray-500 text-center">Click to see full view</p>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            {/* Brand & Share */}
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Visit the {painting.brand} Store
              </a>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ShareIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <FavoriteBorderIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">
              {painting.fullName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              {renderStars(painting.rating)}
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {painting.rating} ({painting.reviews} ratings)
              </span>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-red-600">-{painting.discount}%</span>
                <span className="text-3xl font-medium text-gray-900">
                  ₹{finalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">M.R.P.:</span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{finalOriginalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>

              {/* EMI */}
              <p className="text-sm text-gray-700 mt-2">
                EMI starts at ₹{Math.round(finalPrice / 12).toLocaleString()}. No Cost EMI available
                <button className="text-blue-600 ml-1">EMI options ▼</button>
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Size: {selectedSizeData?.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedSize === size.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{size.name}</p>
                    <p className="text-xs text-gray-500">{size.label}</p>
                    <p className="text-sm font-bold mt-1">
                      ₹{Math.round(painting.price * size.priceMultiplier).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <LocalShippingIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">FREE Delivery</p>
                  <p className="text-sm text-green-600">{painting.deliveryDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <VerifiedIcon className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-600">In Stock</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 rounded-full font-medium text-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-full font-medium text-white transition-colors disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Premium Golden Frame Included</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>HD Canvas Print Quality</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>Ready to Hang</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>10 Days Easy Returns</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">About this item</h3>
              <p className="text-sm text-gray-700">{painting.longDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
