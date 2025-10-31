import { StyleSheet } from "react-native";
import { AppStyles } from "@/styles";
import { COLORS } from "@/theme";
import { scale, moderateScale } from "@/utils/scale";

export const styles = StyleSheet.create({
  container: {
    ...AppStyles.fill,
    backgroundColor: "#F1F5F9",
  },

  // Floating Header styles
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profilePicture: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  profilePictureImage: {
    width: "100%",
    height: "100%",
    borderRadius: scale(24),
  },
  headerTextContent: {
    flex: 1,
  },
  headerName: {
    fontSize: moderateScale(17),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: scale(2),
  },
  headerEmail: {
    fontSize: moderateScale(13),
    color: "#64748B",
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  // Hero Section
  heroSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: scale(20),
    marginBottom: scale(20),
    padding: scale(24),
    borderRadius: scale(20),
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroIcon: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(16),
  },
  heroTitle: {
    fontSize: moderateScale(22),
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: scale(8),
  },
  heroSubtitle: {
    fontSize: moderateScale(14),
    color: "#64748B",
    textAlign: "center",
    lineHeight: moderateScale(20),
  },

  // Status Section
  statusSection: {
    flexDirection: "row",
    marginHorizontal: scale(20),
    marginBottom: scale(24),
    gap: scale(12),
  },
  statusCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: scale(20),
    borderRadius: scale(16),
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusIcon: {
    marginBottom: scale(12),
  },
  statusTitle: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginBottom: scale(4),
  },
  statusValue: {
    fontSize: moderateScale(16),
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: scale(8),
  },
  statusDescription: {
    fontSize: moderateScale(11),
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: moderateScale(15),
  },

  // Section
  section: {
    marginHorizontal: scale(20),
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: scale(16),
  },

  // Feature Cards
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: scale(16),
    marginBottom: scale(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(16),
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: scale(4),
  },
  featureDescription: {
    fontSize: moderateScale(13),
    color: "#64748B",
    lineHeight: moderateScale(18),
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: scale(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: scale(20),
    borderRadius: scale(16),
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: moderateScale(32),
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#64748B",
    marginBottom: scale(8),
  },
  statDescription: {
    fontSize: moderateScale(11),
    color: "#94A3B8",
    textAlign: "center",
  },

  // Info Section
  infoSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: scale(20),
    padding: scale(24),
    borderRadius: scale(20),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  infoIconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(16),
    alignSelf: "center",
  },
  infoTitle: {
    fontSize: moderateScale(20),
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: scale(12),
  },
  infoDescription: {
    fontSize: moderateScale(14),
    color: "#64748B",
    lineHeight: moderateScale(22),
    textAlign: "center",
    marginBottom: scale(20),
  },
  infoBadges: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(8),
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(8),
  },
  badgeText: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: COLORS.primary,
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    right: scale(20),
    zIndex: 20,
  },
  fabButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },

  // Scroll Progress
  scrollProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: scale(4),
    backgroundColor: "transparent",
    zIndex: 100,
    overflow: "hidden",
  },
  scrollProgressBar: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: scale(2),
    transformOrigin: "left center",
  },
});
