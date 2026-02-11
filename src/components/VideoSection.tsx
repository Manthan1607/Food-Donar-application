import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VideoSectionProps {
  taglineKey: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

const VideoSection = ({ taglineKey, videoUrl, thumbnailUrl }: VideoSectionProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden group cursor-pointer"
    >
      {/* Video or thumbnail */}
      {videoUrl ? (
        <video
          src={videoUrl}
          className="w-full h-44 object-cover"
          muted
          autoPlay
          loop
          playsInline
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-muted to-card flex items-center justify-center">
          <div className="w-16 h-16 rounded-full glass-card-strong flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-primary ml-1" />
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Tagline */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-foreground font-display font-semibold text-lg leading-tight"
        >
          "{t(taglineKey)}"
        </motion.p>
        <div className="w-12 h-1 rounded-full gradient-primary mt-2" />
      </div>
    </motion.div>
  );
};

export default VideoSection;
