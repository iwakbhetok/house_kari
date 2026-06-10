import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import styles from "@/styles/Rfq.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, Trans } from "next-i18next";
import { FaWhatsapp, FaPlus } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

// ─── Country phone codes ──────────────────────────────────────────────────────
const PHONE_CODES = [
  { code: "+61", country: "Australia" },
  { code: "+673", country: "Brunei" },
  { code: "+855", country: "Cambodia" },
  { code: "+86", country: "China" },
  { code: "+852", country: "Hong Kong" },
  { code: "+91", country: "India" },
  { code: "+62", country: "Indonesia" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+856", country: "Laos" },
  { code: "+60", country: "Malaysia" },
  { code: "+95", country: "Myanmar" },
  { code: "+63", country: "Philippines" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+65", country: "Singapore" },
  { code: "+886", country: "Taiwan" },
  { code: "+66", country: "Thailand" },
  { code: "+971", country: "UAE" },
  { code: "+44", country: "United Kingdom" },
  { code: "+1", country: "United States" },
  { code: "+84", country: "Vietnam" },
];

// ─── Static product catalog (replace with Payload CMS fetch later) ────────────
const PRODUCTS = [
  { id: 1, name: "House Japanese Curry Original 935g", pricePerCarton: 285000, unitsPerCarton: 20, shelfLifeMonths: 18 },
  { id: 2, name: "House Japanese Curry Spicy 935g",    pricePerCarton: 285000, unitsPerCarton: 20, shelfLifeMonths: 18 },
  { id: 3, name: "House Japanese Curry Original 300g", pricePerCarton: 195000, unitsPerCarton: 60, shelfLifeMonths: 18 },
  { id: 4, name: "House Japanese Curry Spicy 300g",    pricePerCarton: 195000, unitsPerCarton: 60, shelfLifeMonths: 18 },
  { id: 5, name: "House Curry Powder 250g",            pricePerCarton: 145000, unitsPerCarton: 10, shelfLifeMonths: 24 },
  { id: 6, name: "House Wasabi Powder 500g",           pricePerCarton: 180000, unitsPerCarton: 10, shelfLifeMonths: 24 },
  { id: 7, name: "House Brown Roux 1kg",               pricePerCarton: 250000, unitsPerCarton: 20, shelfLifeMonths: 18 },
];

const RETAIL_THRESHOLD = 5;  // ≤ 5 cartons per item → show price; > 5 → quote
const MIN_ORDER_CARTONS = 5; // total cart must reach this to proceed

// ─── Shipment options ─────────────────────────────────────────────────────────
const SHIPMENT_OPTIONS = [
  {
    group: "International",
    labelKey: "rfq.step2.international",
    options: ["Ray Speed", "DHL", "General Cargo - AIR", "General Cargo - Ocean"],
  },
  {
    group: "Domestic",
    labelKey: "rfq.step2.domestic",
    options: ["Mas Cargo - LAND", "Mas Cargo - AIR", "Deliveree", "Trucking Delivery"],
  },
];

const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const generateQuoteNumber = () => {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HNV-${d}-${rand}`;
};

const getValidityDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const STEPS = [
  { n: 1, labelKey: "rfq.steps.contactInfo" },
  { n: 2, labelKey: "rfq.steps.products" },
  { n: 3, labelKey: "rfq.steps.preview" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RFQPage() {
  const { t } = useTranslation("common");
  const [step, setStep] = useState(1);
  const [quoteNumber, setQuoteNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Step 1
  const [contact, setContact] = useState({
    company: "",
    name: "",
    email: "",
    phoneCode: "+62",
    phone: "",
    agree: false,
  });
  const [contactErrors, setContactErrors] = useState({});
  const [phoneCodeOpen, setPhoneCodeOpen] = useState(false);
  const phoneCodeRef = useRef(null);

  useEffect(() => {
    if (!phoneCodeOpen) return;
    const handleClickOutside = (e) => {
      if (phoneCodeRef.current && !phoneCodeRef.current.contains(e.target)) {
        setPhoneCodeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [phoneCodeOpen]);

  // Step 2
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [productError, setProductError] = useState("");
  const [selectedShipment, setSelectedShipment] = useState("");
  const [shipmentError, setShipmentError] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────
  const currentProduct = PRODUCTS.find((p) => p.id === parseInt(selectedProductId));

  const getPriceInfo = (product, qty) => {
    if (qty <= RETAIL_THRESHOLD)
      return { type: "retail", label: `${formatIDR(product.pricePerCarton)} ${t("rfq.step2.pricePerCarton")}` };
    return { type: "quote", label: t("rfq.step2.salesRepContact") };
  };

  const getQuantityError = (qty) => {
    if (qty < 1) return t("rfq.step2.minQtyError");
    return null;
  };

  const totalCartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const priceInfo = currentProduct ? getPriceInfo(currentProduct, quantity) : null;
  const qtyError = getQuantityError(quantity);

  // ── Step 1 handlers ──────────────────────────────────────────────────────
  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateContact = () => {
    const errs = {};
    if (!contact.company.trim()) errs.company = t("rfq.step1.errorRequired");
    if (!contact.name.trim()) errs.name = t("rfq.step1.errorRequired");
    if (!contact.email.trim()) errs.email = t("rfq.step1.errorRequired");
    else if (!/^\S+@\S+\.\S+$/.test(contact.email)) errs.email = t("rfq.step1.errorInvalidEmail");
    if (!contact.phone.trim()) errs.phone = t("rfq.step1.errorPhoneRequired");
    if (!contact.agree) errs.agree = t("rfq.step1.errorAgree");
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Step 2 handlers ──────────────────────────────────────────────────────
  const adjustQty = (delta) =>
    setQuantity((q) => Math.max(1, q + delta));

  const handleAddProduct = () => {
    if (qtyError) { setProductError(qtyError); return; }
    setProductError("");
    const existing = cartItems.findIndex((item) => item.productId === currentProduct.id);
    if (existing >= 0) {
      const updated = [...cartItems];
      updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + quantity };
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: currentProduct.id,
          name: currentProduct.name,
          quantity,
          pricePerCarton: currentProduct.pricePerCarton,
        },
      ]);
    }
    setQuantity(1);
  };

  const handleRemoveItem = (productId) =>
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));

  // ── Step 3 → 4 ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    const qn = generateQuoteNumber();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await axios.post(
        `/api/rfq-submissions`,
        {
          quoteNumber: qn,
          contactInfo: {
            company: contact.company,
            contactName: contact.name,
            email: contact.email,
            phone: `${contact.phoneCode} ${contact.phone}`,
          },
          products: cartItems.map((item) => {
            const isBulk = item.quantity > RETAIL_THRESHOLD;
            return {
              productName: item.name,
              quantity: item.quantity,
              ...(isBulk ? {} : {
                unitPrice: item.pricePerCarton,
                subtotal: item.pricePerCarton * item.quantity,
              }),
              isBulkPriced: isBulk,
            };
          }),
          shipmentMethod: selectedShipment,
          salesTracking: { status: "pending" },
        }
      );
      setQuoteNumber(qn);
      setStep(4);
    } catch {
      setSubmitError(t("rfq.step3.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setContact({ company: "", name: "", email: "", phoneCode: "+62", phone: "", agree: false });
    setCartItems([]);
    setQuantity(1);
    setQuoteNumber("");
    setContactErrors({});
    setProductError("");
    setSelectedProductId(PRODUCTS[0].id);
    setSelectedShipment("");
    setShipmentError("");
  };

  const handleProceedToPreview = () => {
    if (totalCartQty < MIN_ORDER_CARTONS) return;
    if (!selectedShipment) { setShipmentError(t("rfq.step2.shipmentError")); return; }
    setShipmentError("");
    setStep(3);
  };

  // ── WhatsApp deep link ────────────────────────────────────────────────
  const waText = t("rfq.whatsapp.message", { quoteNumber });
  const waUrl = `https://wa.me/628119069464?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <Head>
        <title>{t("rfq.meta.title")}</title>
        <meta name="description" content={t("rfq.meta.description")} />
      </Head>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <img
          src="/images/rfq-hero.webp"
          alt="RFQ Banner"
          onError={(e) => { e.target.src = "/images/banner-1.png"; }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>{t("rfq.hero.eyebrow")}</p>
          <h1>{t("rfq.hero.title")}</h1>
          <p className={styles.heroSub}>{t("rfq.hero.subtitle")}</p>
        </div>
      </div>

      {/* ─── STEP INDICATOR ────────────────────────────────────────────────── */}
      {step < 4 && (
        <div className={styles.stepsBar}>
          <div className={styles.stepsInner}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={styles.stepItem}>
                <div
                  className={`${styles.stepCircle} ${
                    step === s.n ? styles.stepActive : step > s.n ? styles.stepDone : ""
                  }`}
                >
                  {step > s.n ? <IoCheckmark /> : s.n}
                </div>
                <span
                  className={`${styles.stepLabel} ${
                    step >= s.n ? styles.stepLabelActive : ""
                  }`}
                >
                  {t(s.labelKey)}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`${styles.stepConnector} ${
                      step > s.n ? styles.stepConnectorDone : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CONTENT ──────────────────────────────────────────────────────── */}
      <div className={styles.content}>
        <div className={styles.contentInner}>

          {/* ══════ STEP 1 — CONTACT ══════════════════════════════════════════ */}
          {step === 1 && (
            <>
              <div className={styles.sectionHeader}>
                <h2>{t("rfq.step1.heading")}</h2>
                <p>{t("rfq.step1.subheading")}</p>
              </div>

              <div className={styles.formCard}>
                <div className={styles.formGrid}>

                  <Field label={t("rfq.step1.fullName")} error={contactErrors.name}>
                    <input
                      name="name"
                      value={contact.name}
                      onChange={handleContactChange}
                      placeholder={t("rfq.step1.fullNamePlaceholder")}
                    />
                  </Field>

                  <Field label={t("rfq.step1.email")} error={contactErrors.email}>
                    <input
                      name="email"
                      type="email"
                      value={contact.email}
                      onChange={handleContactChange}
                      placeholder={t("rfq.step1.emailPlaceholder")}
                    />
                  </Field>

                  <Field label={t("rfq.step1.company")} error={contactErrors.company}>
                    <input
                      name="company"
                      value={contact.company}
                      onChange={handleContactChange}
                      placeholder={t("rfq.step1.companyPlaceholder")}
                    />
                  </Field>

                  <Field label={t("rfq.step1.phone")} error={contactErrors.phone}>
                    <div className={styles.phoneRow}>
                      <div
                        ref={phoneCodeRef}
                        className={styles.phoneCodeSelect}
                        onClick={() => setPhoneCodeOpen((o) => !o)}
                      >
                        <span>{contact.phoneCode}</span>
                        {phoneCodeOpen && (
                          <ul className={styles.phoneCodeDropdown}>
                            {PHONE_CODES.map((pc) => (
                              <li
                                key={pc.code}
                                className={`${styles.phoneCodeOption} ${contact.phoneCode === pc.code ? styles.phoneCodeOptionActive : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContact((prev) => ({ ...prev, phoneCode: pc.code }));
                                  setPhoneCodeOpen(false);
                                }}
                              >
                                {pc.code} - {pc.country}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <input
                        name="phone"
                        value={contact.phone}
                        onChange={handleContactChange}
                        placeholder={t("rfq.step1.phonePlaceholder")}
                        className={styles.phoneInput}
                      />
                    </div>
                  </Field>

                </div>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="agree"
                    checked={contact.agree}
                    onChange={handleContactChange}
                  />
                  <span>
                    <Trans
                      i18nKey="rfq.step1.agree"
                      components={{
                        link: <Link href="/privacy-policy" className={styles.checkLink} />,
                      }}
                    />
                  </span>
                </label>
                {contactErrors.agree && (
                  <p className={styles.fieldError}>{contactErrors.agree}</p>
                )}

                <div className={styles.btnRow}>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => { if (validateContact()) setStep(2); }}
                  >
                    {t("rfq.step1.continueBtn")}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════ STEP 2 — PRODUCTS ═════════════════════════════════════════ */}
          {step === 2 && (
            <>
              <div className={styles.sectionHeader}>
                <h2>{t("rfq.step2.heading")}</h2>
                <p>
                  <Trans
                    i18nKey="rfq.step2.subheading"
                    values={{ count: MIN_ORDER_CARTONS, threshold: RETAIL_THRESHOLD }}
                    components={{ strong: <strong /> }}
                  />
                </p>
              </div>

              <div className={styles.formCard}>
                {/* ── Selector ── */}
                <div className={styles.selectorGrid}>
                  <div>
                    <Field label={t("rfq.step2.productLabel")}>
                      <select
                        value={selectedProductId}
                        onChange={(e) => {
                          setSelectedProductId(e.target.value);
                          setQuantity(1);
                          setProductError("");
                        }}
                      >
                        {PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    {currentProduct && (
                      <p className={styles.productMeta}>
                        {t("rfq.step2.productMeta", {
                          units: currentProduct.unitsPerCarton,
                          months: currentProduct.shelfLifeMonths,
                        })}
                      </p>
                    )}
                  </div>

                  <Field label={t("rfq.step2.quantityLabel")}>
                    <div className={styles.stepper}>
                      <button
                        className={styles.stepperBtn}
                        type="button"
                        onClick={() => adjustQty(-1)}
                      >
                        −
                      </button>
                      <input
                        className={styles.stepperInput}
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
                      />
                      <button
                        className={styles.stepperBtn}
                        type="button"
                        onClick={() => adjustQty(1)}
                      >
                        +
                      </button>
                    </div>
                  </Field>
                </div>

                {/* ── Dynamic price display ── */}
                {currentProduct && (
                  <div className={styles.priceRow}>
                    {qtyError ? (
                      <span className={`${styles.pricePill} ${styles.pillError}`}>
                        ⚠ {qtyError}
                      </span>
                    ) : priceInfo.type === "retail" ? (
                      <span className={`${styles.pricePill} ${styles.pillRetail}`}>
                        💰 {priceInfo.label}
                      </span>
                    ) : (
                      <span className={`${styles.pricePill} ${styles.pillQuote}`}>
                        📋 {priceInfo.label}
                      </span>
                    )}
                  </div>
                )}
                {productError && (
                  <p className={styles.fieldError} style={{ marginBottom: "12px" }}>
                    {productError}
                  </p>
                )}

                <button
                  className={styles.addBtn}
                  onClick={handleAddProduct}
                  disabled={!!qtyError}
                >
                  <FaPlus size={12} /> {t("rfq.step2.addToQuote")}
                </button>

                <div className={styles.divider} />

                {/* ── Cart list ── */}
                {cartItems.length === 0 ? (
                  <p className={styles.emptyMsg}>
                    {t("rfq.step2.emptyCart")}
                  </p>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.productTable}>
                      <thead>
                        <tr>
                          <th>{t("rfq.step2.tableProduct")}</th>
                          <th className={styles.tdCenter}>{t("rfq.step2.tableQty")}</th>
                          <th className={styles.tdRight}>{t("rfq.step2.tableUnitPrice")}</th>
                          <th className={styles.tdRight}>{t("rfq.step2.tableSubtotal")}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => {
                          const isRetail = item.quantity <= RETAIL_THRESHOLD;
                          return (
                            <tr key={item.productId}>
                              <td>{item.name}</td>
                              <td className={styles.tdCenter}>{item.quantity}</td>
                              <td className={styles.tdRight}>
                                {isRetail ? (
                                  <span className={styles.priceCell}>
                                    {formatIDR(item.pricePerCarton)}
                                  </span>
                                ) : (
                                  <em className={styles.tbqCell}>{t("rfq.step2.toBeQuoted")}</em>
                                )}
                              </td>
                              <td className={styles.tdRight}>
                                {isRetail ? (
                                  <span className={styles.priceCell}>
                                    {formatIDR(item.pricePerCarton * item.quantity)}
                                  </span>
                                ) : (
                                  <em className={styles.tbqCell}>{t("rfq.step2.tbq")}</em>
                                )}
                              </td>
                              <td>
                                <button
                                  className={styles.removeBtn}
                                  onClick={() => handleRemoveItem(item.productId)}
                                  aria-label="Remove"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── Minimum order indicator ── */}
                <div className={styles.minOrderBar}>
                  <span>
                    {t("rfq.step2.totalLabel")} <strong>{totalCartQty} {totalCartQty !== 1 ? t("rfq.step2.cartons") : t("rfq.step2.carton")}</strong>
                  </span>
                  {totalCartQty < MIN_ORDER_CARTONS && (
                    <span className={styles.minOrderWarning}>
                      {t("rfq.step2.minOrderWarning", { min: MIN_ORDER_CARTONS, remaining: MIN_ORDER_CARTONS - totalCartQty })}
                    </span>
                  )}
                </div>
                <div>
                  <p className={styles.productNoteLabel}>*The above prices are quoted Franco Jakarta, Indonesia. </p>
                </div>

                <div className={styles.divider} style={{ marginTop: "20px" }} />

                {/* ── Shipment options ── */}
                <div className={styles.shipmentSection}>
                  <p className={styles.shipmentTitle}>{t("rfq.step2.shipmentTitle")}</p>
                  {shipmentError && (
                    <p className={styles.fieldError} style={{ marginBottom: "10px" }}>
                      {shipmentError}
                    </p>
                  )}
                  <div className={styles.shipmentGroups}>
                    {SHIPMENT_OPTIONS.map((group) => (
                      <div key={group.group} className={styles.shipmentGroup}>
                        <p className={styles.shipmentGroupLabel}>{t(group.labelKey)}</p>
                        <div className={styles.shipmentOptions}>
                          {group.options.map((opt) => (
                            <label
                              key={opt}
                              className={`${styles.shipmentCard} ${selectedShipment === opt ? styles.shipmentCardActive : ""}`}
                            >
                              <input
                                type="radio"
                                name="shipment"
                                value={opt}
                                checked={selectedShipment === opt}
                                onChange={() => { setSelectedShipment(opt); setShipmentError(""); }}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className={styles.productNoteLabel}>* Import Regulation are Buyer Responsibility.</p>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleProceedToPreview}
                    disabled={totalCartQty < MIN_ORDER_CARTONS}
                  >
                    {t("rfq.step2.previewBtn")}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════ STEP 3 — PREVIEW ══════════════════════════════════════════ */}
          {step === 3 && (
            <>
              <div className={styles.sectionHeader}>
                <h2>{t("rfq.step3.heading")}</h2>
                <p>{t("rfq.step3.subheading")}</p>
              </div>

              <div className={styles.previewDoc}>
                {/* Doc header */}
                <div className={styles.previewDocHeader}>
                  <div>
                    <p className={styles.previewEyebrow}>{t("rfq.step3.docEyebrow")}</p>
                    <h3 className={styles.previewTitle}>{t("rfq.step3.docTitle")}</h3>
                  </div>
                  <div className={styles.dateBadge}>
                    <span>{t("rfq.step3.submissionDate")}</span>
                    <strong>
                      {new Date().toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                </div>
                <div className={styles.goldStripe} />

                <div className={styles.previewBody}>
                  {/* Info grid */}
                  <div className={styles.previewInfoGrid}>
                    <div className={styles.previewSection}>
                      <h4 className={styles.previewSectionTitle}>{t("rfq.step3.companyDetails")}</h4>
                      <InfoRow label={t("rfq.step3.companyLabel")} value={contact.company} />
                      <InfoRow label={t("rfq.step3.contactLabel")} value={contact.name} />
                    </div>
                    <div className={styles.previewSection}>
                      <h4 className={styles.previewSectionTitle}>{t("rfq.step3.contactInfo")}</h4>
                      <InfoRow label={t("rfq.step3.emailLabel")} value={contact.email} />
                      <InfoRow label={t("rfq.step3.phoneLabel")} value={`${contact.phoneCode} ${contact.phone}`} />
                      <InfoRow
                        label={t("rfq.step3.shipmentLabel")}
                        value={(() => {
                          const group = SHIPMENT_OPTIONS.find((g) => g.options.includes(selectedShipment));
                          return group ? `${selectedShipment} — ${t(group.labelKey)}` : selectedShipment;
                        })()}
                      />
                    </div>
                  </div>

                  {/* Products table */}
                  <div className={styles.previewSection}>
                    <h4 className={styles.previewSectionTitle}>{t("rfq.step3.requestedProducts")}</h4>
                    <table className={styles.previewTable}>
                      <thead>
                        <tr>
                          <th>{t("rfq.step3.tableNum")}</th>
                          <th>{t("rfq.step3.tableProduct")}</th>
                          <th className={styles.tdCenter}>{t("rfq.step3.tableQty")}</th>
                          <th className={styles.tdRight}>{t("rfq.step3.tableUnitPrice")}</th>
                          <th className={styles.tdRight}>{t("rfq.step3.tableSubtotal")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, i) => {
                          const isRetail = item.quantity <= RETAIL_THRESHOLD;
                          return (
                            <tr key={item.productId}>
                              <td>{i + 1}</td>
                              <td>{item.name}</td>
                              <td className={styles.tdCenter}>{item.quantity}</td>
                              <td className={`${styles.tdRight} ${isRetail ? styles.priceCell : styles.tbqCell}`}>
                                {isRetail ? formatIDR(item.pricePerCarton) : t("rfq.step3.willBeQuoted")}
                              </td>
                              <td className={`${styles.tdRight} ${isRetail ? styles.priceCell : styles.tbqCell}`}>
                                {isRetail
                                  ? formatIDR(item.pricePerCarton * item.quantity)
                                  : t("rfq.step3.tbq")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Validity note */}
                  <div className={styles.validityNote}>
                    <span className={styles.validityIcon}>ℹ️</span>
                    <p>
                      <Trans
                        i18nKey="rfq.step3.validityNote"
                        values={{ date: getValidityDate(), email: contact.email }}
                        components={{ strong: <strong /> }}
                      />
                    </p>
                  </div>
                </div>

                {submitError && (
                  <p className={styles.fieldError} style={{ marginBottom: "12px", textAlign: "center" }}>
                    {submitError}
                  </p>
                )}
                <div className={styles.previewActions}>
                  <button className={styles.btnOutlineDark} onClick={() => setStep(2)} disabled={isSubmitting}>
                    {t("rfq.step3.editBtn")}
                  </button>
                  <button className={styles.btnConfirm} onClick={handleConfirm} disabled={isSubmitting}>
                    {isSubmitting ? t("rfq.step3.submittingBtn") : t("rfq.step3.confirmBtn")}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════ STEP 4 — SUCCESS ══════════════════════════════════════════ */}
          {step === 4 && (
            <div className={styles.successCard}>
              <div className={styles.successHeader}>
                <div className={styles.checkCircle}>
                  <IoCheckmark size={32} />
                </div>
                <h3>{t("rfq.step4.heading")}</h3>
                <p>{t("rfq.step4.subheading")}</p>
              </div>
              <div className={styles.goldStripe} />
              <div className={styles.successBody}>
                <div className={styles.quoteNumberBox}>
                  <span>{t("rfq.step4.quoteNumberLabel")}</span>
                  <strong>{quoteNumber}</strong>
                </div>
                <p className={styles.successMsg}>
                  <Trans
                    i18nKey="rfq.step4.successMsg"
                    values={{ email: contact.email }}
                    components={{ strong: <strong />, br: <br /> }}
                  />
                </p>
                <div className={styles.successActions}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnWhatsApp}
                  >
                    <FaWhatsapp size={18} />
                    {t("rfq.step4.whatsappBtn")}
                  </a>
                  <button className={styles.btnOutlineDark} onClick={handleReset}>
                    {t("rfq.step4.anotherRfqBtn")}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// ─── Local helpers ────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.fieldLabel}>{label}</label>}
      {children}
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}
