import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import {
  Save,
  Film,
  Calendar,
  Clock,
  Star,
  Globe,
  User,
  Image as ImageIcon,
  AlignLeft,
} from "lucide-react";
import Swal from "sweetalert2";
import CommonPageHeader from "../CommonPageHeader";
import { LazyLoadImage } from "react-lazy-load-image-component";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Adventure",
  "Romance",
  "Animation",
];

const EditMovie = ({ isEdit }) => {
  const { movies, user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    director: "",
    cast: "",
    rating: "",
    runtime: "",
    description: "",
    poster: "",
    language: "",
    country: "",
    createAt: new Date(),
  });

  // Load Data for Edit Mode
  useEffect(() => {
    if (isEdit && id) {
      const movie = movies.find((m) => m._id === id);
      if (movie) {
        setFormData({
          title: movie.title || "",
          genre: movie.genre || "",
          year: movie.year || "",
          director: movie.director || "",
          cast: movie.cast || "",
          rating: movie.rating || "",
          runtime: movie.runtime || "",
          description: movie.description || "",
          poster: movie.poster || "",
          language: movie.language || "",
          country: movie.country || "",
        });
      }
    }
  }, [isEdit, id, movies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const castArray = formData.cast
        .split(",")
        .map((actor) => actor.trim())
        .filter((actor) => actor !== "");

      const payload = {
        ...formData,
        rating: parseFloat(formData.rating),
        year: parseInt(formData.year),
        runtime: parseInt(formData.runtime),

        cast: castArray,

        updatedAt: new Date(),
        addedBy: isEdit ? undefined : user?.email,
        status: "pending",
      };

      let res;
      if (isEdit) {
        res = await axiosSecure.patch(`/movies/update/${id}`, payload);
      } else {
        res = await axiosSecure.post("/movies", payload);
      }

      const successCondition = isEdit
        ? res.data.modifiedCount
        : res.data.insertedId;

      if (successCondition) {
        Swal.fire({
          icon: "success",
          title: isEdit ? "Updated Successfully!" : "Movie Added!",
          showConfirmButton: false,
          timer: 1500,
          background: "#1a1a1a",
          color: "#fff",
        });
        navigate(isEdit ? `/movie-details/${id}` : "/all-movies");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100  relative overflow-hidden -mt-15">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-primary/5 rounded-full blur-[150px] -z-10" />

      {/* --- Header Section (Corrected) --- */}
      <CommonPageHeader
        title={isEdit ? "Update Masterpiece" : "Add New Movie"}
        subtitle={
          isEdit
            ? "Refine the details of your collection."
            : "Contribute to the global cinematic database."
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* --- LEFT: LIVE PREVIEW (Sticky) --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 hidden lg:block">
            <div className="p-6 rounded-4xl bg-base-200/50 border border-base-content/5 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-4">
                Live Preview
              </h3>

              {/* Preview Card */}
              <div className="relative aspect-2/3 rounded-2xl overflow-hidden bg-black shadow-2xl group">
                {formData.poster ? (
                  // <img
                  //   src={formData.poster}
                  //   alt="Preview"
                  //   className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  //   onError={(e) =>
                  //     (e.target.src =
                  //       "https://placehold.co/400x600/1f2937/ffffff?text=No+Poster")
                  //   }
                  // />
                  <LazyLoadImage
                    src={formData.poster}
                    alt="Preview"
                    effect="blur"
                    width="100%"
                    height={300}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                    <ImageIcon size={48} />
                    <span className="text-sm mt-2 font-medium">
                      Poster Preview
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <span className="px-2 py-1 bg-primary text-[10px] font-bold uppercase rounded mb-2 inline-block">
                    {formData.genre || "Genre"}
                  </span>
                  <h3 className="text-2xl font-black leading-tight mb-2">
                    {formData.title || "Movie Title"}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-bold opacity-80">
                    <span className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-current"
                      />{" "}
                      {formData.rating || "0"}
                    </span>
                    <span>•</span>
                    <span>{formData.year || "Year"}</span>
                    <span>•</span>
                    <span>{formData.runtime || "0"} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: FORM --- */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="bg-base-100 border border-base-200 p-6 md:p-10 rounded-[2.5rem] shadow-xl relative z-10"
            >
              {/* Section 1: Essential Details */}
              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-lg font-bold text-base-content mb-6 pb-2 border-b border-base-content/10">
                  <Film className="text-primary" size={20} /> Essential Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <FormInput
                      label="Movie Title"
                      name="title"
                      icon={Film}
                      placeholder="e.g. Inception"
                      required
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                  <FormSelect
                    label="Genre"
                    name="genre"
                    icon={Film}
                    options={GENRES}
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <FormInput
                    label="Release Year"
                    name="year"
                    type="number"
                    icon={Calendar}
                    placeholder="2024"
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <FormInput
                    label="Director"
                    name="director"
                    icon={User}
                    placeholder="Christopher Nolan"
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <FormInput
                    label="Language"
                    name="language"
                    icon={Globe}
                    placeholder="English"
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <FormInput
                    label="Country"
                    name="country"
                    icon={Globe}
                    placeholder="USA"
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </div>

              {/* Section 2: Metrics & Media */}
              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-lg font-bold text-base-content mb-6 pb-2 border-b border-base-content/10">
                  <Star className="text-primary" size={20} /> Metrics & Media
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Rating (0-10)"
                    name="rating"
                    type="number"
                    icon={Star}
                    step="0.1"
                    max="10"
                    placeholder="8.8"
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <FormInput
                    label="Duration (min)"
                    name="runtime"
                    type="number"
                    icon={Clock}
                    placeholder="148"
                    required
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <div className="col-span-full">
                    <FormInput
                      label="Poster URL"
                      name="poster"
                      type="url"
                      icon={ImageIcon}
                      placeholder="https://image.tmdb.org/..."
                      required
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                  <div className="col-span-full">
                    <FormInput
                      label="Main Cast (Comma separated)"
                      name="cast"
                      icon={User}
                      placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt"
                      required
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Story */}
              <div className="mb-10">
                <h4 className="flex items-center gap-2 text-lg font-bold text-base-content mb-6 pb-2 border-b border-base-content/10">
                  <AlignLeft className="text-primary" size={20} /> The Story
                </h4>
                <div className="relative">
                  <textarea
                    required
                    rows="5"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-base-200 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all resize-none text-base-content placeholder:text-base-content/30 font-medium"
                    placeholder="Write a compelling summary of the plot..."
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 rounded-xl font-bold bg-base-200 text-base-content hover:bg-base-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <Save size={20} />
                  )}
                  {isEdit ? "Update Movie" : "Publish Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovie;
