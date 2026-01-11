import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import axios from "axios";
import {
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineSearch,
  HiOutlineChevronRight,
  HiOutlineDocumentText,
} from "react-icons/hi";

const Grammar = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const [grammar, setGrammar] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLevels();
    fetchGrammar();
  }, [selectedLevel]);

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/levels`);
      setLevels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchGrammar = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/grammar?status=published`;
      if (selectedLevel) url += `&level=${selectedLevel}`;

      const response = await axios.get(url);
      setGrammar(response.data.data || []);
    } catch (error) {
      console.error("Error fetching grammar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filteredGrammar = grammar.filter((item) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.title?.de?.toLowerCase().includes(search) ||
      item.title?.en?.toLowerCase().includes(search) ||
      item.title?.bn?.includes(searchTerm) ||
      item.description?.en?.toLowerCase().includes(search) ||
      item.description?.bn?.includes(searchTerm)
    );
  });

  // Group by level
  const groupedGrammar = filteredGrammar.reduce((acc, item) => {
    const levelCode = item.level?.code || "Other";
    if (!acc[levelCode]) {
      acc[levelCode] = [];
    }
    acc[levelCode].push(item);
    return acc;
  }, {});

  // Level colors
  const getLevelColor = (code) => {
    switch (code) {
      case "A1":
        return {
          bg: "from-emerald-500/20 to-teal-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          badge: "bg-emerald-500/20 text-emerald-400",
        };
      case "A2":
        return {
          bg: "from-blue-500/20 to-indigo-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-400",
        };
      case "B1":
        return {
          bg: "from-purple-500/20 to-pink-500/10",
          border: "border-purple-500/30",
          text: "text-purple-400",
          badge: "bg-purple-500/20 text-purple-400",
        };
      default:
        return {
          bg: "from-ds-surface/50 to-ds-surface/30",
          border: "border-ds-border/30",
          text: "text-ds-muted",
          badge: "bg-ds-muted/20 text-ds-muted",
        };
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ds-surface/50 border border-ds-border/30 mb-4">
            <HiOutlineBookOpen className="w-5 h-5 text-ds-muted" />
            <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "জার্মান ব্যাকরণ" : "German Grammar"}
            </span>
          </div>

          <h1
            className={`text-4xl md:text-5xl font-black text-ds-text mb-3 ${isBengali ? "font-bangla" : ""}`}
          >
            {isBengali ? "ব্যাকরণ" : "Grammar"}
          </h1>

          <p className={`text-ds-muted max-w-xl mx-auto ${isBengali ? "font-bangla" : ""}`}>
            {isBengali
              ? "জার্মান ব্যাকরণের নিয়ম, সংযোগ সারণি এবং উদাহরণ সহ শিখুন"
              : "Learn German grammar rules with conjugation tables, examples, and explanations"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
            <input
              type="text"
              placeholder={isBengali ? "ব্যাকরণ খুঁজুন..." : "Search grammar topics..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border ${
                isBengali ? "font-bangla" : ""
              }`}
            />
          </div>

          {/* Level Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLevel("")}
              className={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                selectedLevel === ""
                  ? "bg-ds-text text-ds-bg"
                  : "bg-ds-surface/50 text-ds-muted hover:text-ds-text border border-ds-border/30"
              }`}
            >
              {isBengali ? "সব" : "All"}
            </button>
            {levels.map((level) => (
              <button
                key={level._id}
                onClick={() => setSelectedLevel(level._id)}
                className={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedLevel === level._id
                    ? "bg-ds-text text-ds-bg"
                    : "bg-ds-surface/50 text-ds-muted hover:text-ds-text border border-ds-border/30"
                }`}
              >
                {level.code}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
          </div>
        ) : filteredGrammar.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <HiOutlineDocumentText className="w-16 h-16 text-ds-muted mx-auto mb-4" />
            <h3 className={`text-xl font-semibold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "কোনো ব্যাকরণ পাওয়া যায়নি" : "No grammar topics found"}
            </h3>
            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {searchTerm
                ? isBengali
                  ? "আপনার অনুসন্ধান পরিবর্তন করুন"
                  : "Try adjusting your search"
                : isBengali
                ? "শীঘ্রই ব্যাকরণ বিষয় যোগ করা হবে"
                : "Grammar topics will be added soon"}
            </p>
          </div>
        ) : selectedLevel ? (
          /* Flat list when level is selected */
          <div className="grid gap-4 md:grid-cols-2">
            {filteredGrammar.map((item) => {
              const colors = getLevelColor(item.level?.code);
              return (
                <Link
                  key={item._id}
                  to={`/grammar/${item.slug}`}
                  className={`group p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span
                        className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${colors.badge} mb-3`}
                      >
                        {item.level?.code}
                      </span>
                      <h3 className="text-xl font-bold text-ds-text mb-1">{item.title?.de}</h3>
                      <p className={`text-ds-muted mb-2 ${isBengali ? "font-bangla" : ""}`}>
                        {isBengali && item.title?.bn ? item.title.bn : item.title?.en}
                      </p>
                      {item.description && (
                        <p
                          className={`text-sm text-ds-muted/70 line-clamp-2 ${
                            isBengali ? "font-bangla" : ""
                          }`}
                        >
                          {isBengali && item.description?.bn ? item.description.bn : item.description?.en}
                        </p>
                      )}
                    </div>
                    <HiOutlineChevronRight className="w-5 h-5 text-ds-muted group-hover:text-ds-text group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ds-border/20 text-sm text-ds-muted">
                    <span className="flex items-center gap-1">
                      <HiOutlineDocumentText className="w-4 h-4" />
                      {item.blocksCount || 0} {isBengali ? "ব্লক" : "blocks"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Grouped by level */
          <div className="space-y-10">
            {Object.entries(groupedGrammar).map(([levelCode, items]) => {
              const colors = getLevelColor(levelCode);
              return (
                <div key={levelCode}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center`}>
                      <HiOutlineAcademicCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-ds-text">{levelCode}</h2>
                      <p className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                        {items.length} {isBengali ? "টি বিষয়" : "topics"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                      <Link
                        key={item._id}
                        to={`/grammar/${item.slug}`}
                        className={`group p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-ds-text mb-1">{item.title?.de}</h3>
                            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                              {isBengali && item.title?.bn ? item.title.bn : item.title?.en}
                            </p>
                            {item.description && (
                              <p
                                className={`text-sm text-ds-muted/70 mt-2 line-clamp-2 ${
                                  isBengali ? "font-bangla" : ""
                                }`}
                              >
                                {isBengali && item.description?.bn
                                  ? item.description.bn
                                  : item.description?.en}
                              </p>
                            )}
                          </div>
                          <HiOutlineChevronRight className="w-5 h-5 text-ds-muted group-hover:text-ds-text group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grammar;
