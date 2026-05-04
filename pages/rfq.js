import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Rfq.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  { code: "+62", country: "Indonesia" },
  { code: "+60", country: "Malaysia" },
  { code: "+65", country: "Singapore" },
  { code: "+63", country: "Philippines" },
  { code: "+66", country: "Thailand" },
  { code: "+84", country: "Vietnam" },
  { code: "+855", country: "Cambodia" },
  { code: "+856", country: "Laos" },
  { code: "+95", country: "Myanmar" },
  { code: "+673", country: "Brunei" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+86", country: "China" },
  { code: "+852", country: "Hong Kong" },
  { code: "+886", country: "Taiwan" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
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

const RETAIL_THRESHOLD = 3;  // ≤ 3 cartons per item → show price; > 3 → quote
const MIN_ORDER_CARTONS = 3; // total cart must reach this to proceed

// ─── Shipment options ─────────────────────────────────────────────────────────
const SHIPMENT_OPTIONS = [
  {
    group: "International",
    options: ["Ray Speed", "DHL", "General Cargo - AIR", "General Cargo - Ocean"],
  },
  {
    group: "Domestic",
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
  { n: 1, label: "Contact Info" },
  { n: 2, label: "Products" },
  { n: 3, label: "Preview" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RFQPage() {
  const [step, setStep] = useState(1);
  const [quoteNumber, setQuoteNumber] = useState("");

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
      return { type: "retail", label: `${formatIDR(product.pricePerCarton)} / carton` };
    return { type: "quote", label: "Sales rep will contact you" };
  };

  const getQuantityError = (qty) => {
    if (qty < 1) return "Minimum 1 carton";
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
    if (!contact.company.trim()) errs.company = "Required";
    if (!contact.name.trim()) errs.name = "Required";
    if (!contact.email.trim()) errs.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(contact.email)) errs.email = "Invalid email";
    if (!contact.phone.trim()) errs.phone = "Phone number is required";
    if (!contact.agree) errs.agree = "You must agree to the privacy policy";
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
  const handleConfirm = () => {
    setQuoteNumber(generateQuoteNumber());
    setStep(4);
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
    if (!selectedShipment) { setShipmentError("Please select a shipment method"); return; }
    setShipmentError("");
    setStep(3);
  };

  // ── WhatsApp deep link ────────────────────────────────────────────────
  const waText = `Hello, I have submitted an RFQ on your website. My Quotation Number is *${quoteNumber}*. Please assist me further.`;
  const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <Head>
        <title>Request for Quotation — House of Japanese Curry</title>
        <meta
          name="description"
          content="Submit a bulk purchase request and receive a formal quotation from our sales team."
        />
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
          <p className={styles.heroEyebrow}>B2B Wholesale</p>
          <h1>Request for Quotation</h1>
          <p className={styles.heroSub}>
            Let us know what you need and we'll contact you shortly.
          </p>
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
                  {s.label}
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
                <h2>Let's get started.</h2>
                <p>Please share your details and we will prepare your personalized quotation.</p>
              </div>

              <div className={styles.formCard}>
                <div className={styles.formGrid}>

                  <Field label="Full Name *" error={contactErrors.name}>
                    <input
                      name="name"
                      value={contact.name}
                      onChange={handleContactChange}
                      placeholder="Full name"
                    />
                  </Field>

                  <Field label="Email Address *" error={contactErrors.email}>
                    <input
                      name="email"
                      type="email"
                      value={contact.email}
                      onChange={handleContactChange}
                      placeholder="email@company.com"
                    />
                  </Field>

                  <Field label="Company Name *" error={contactErrors.company}>
                    <input
                      name="company"
                      value={contact.company}
                      onChange={handleContactChange}
                      placeholder="PT. Your Company Name"
                    />
                  </Field>

                  <Field label="Phone Number *" error={contactErrors.phone}>
                    <div className={styles.phoneRow}>
                      <select
                        name="phoneCode"
                        value={contact.phoneCode}
                        onChange={handleContactChange}
                        className={styles.phoneCodeSelect}
                      >
                        {PHONE_CODES.map((pc) => (
                          <option key={pc.code} value={pc.code}>
                            {pc.code} - {pc.country}
                          </option>
                        ))}
                      </select>
                      <input
                        name="phone"
                        value={contact.phone}
                        onChange={handleContactChange}
                        placeholder="81x xxxx xxxx"
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
                    I agree to the{" "}
                    <Link href="/privacy-policy" className={styles.checkLink}>
                      Privacy Policy
                    </Link>{" "}
                    and consent to being contacted regarding this quotation.
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
                    Create Account &amp; Continue →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════ STEP 2 — PRODUCTS ═════════════════════════════════════════ */}
          {step === 2 && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Product Selection</h2>
                <p>
                  Minimum order is <strong>{MIN_ORDER_CARTONS} cartons</strong> in total.
                  Prices shown for ≤ {RETAIL_THRESHOLD} cartons per item — bulk orders will be quoted by our sales team.
                </p>
              </div>

              <div className={styles.formCard}>
                {/* ── Selector ── */}
                <div className={styles.selectorGrid}>
                  <div>
                    <Field label="Products">
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
                        {currentProduct.unitsPerCarton} pcs in 1 carton &nbsp;|&nbsp; Shelf Life: {currentProduct.shelfLifeMonths} months
                      </p>
                    )}
                  </div>

                  <Field label="Quantity (cartons)">
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
                  <FaPlus size={12} /> Add to Quotation
                </button>

                <div className={styles.divider} />

                {/* ── Cart list ── */}
                {cartItems.length === 0 ? (
                  <p className={styles.emptyMsg}>
                    No products added yet. Select a product above and click &quot;Add to Quotation&quot;.
                  </p>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.productTable}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th className={styles.tdCenter}>Qty (cartons)</th>
                          <th className={styles.tdRight}>Unit Price</th>
                          <th className={styles.tdRight}>Subtotal</th>
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
                                  <em className={styles.tbqCell}>To be quoted</em>
                                )}
                              </td>
                              <td className={styles.tdRight}>
                                {isRetail ? (
                                  <span className={styles.priceCell}>
                                    {formatIDR(item.pricePerCarton * item.quantity)}
                                  </span>
                                ) : (
                                  <em className={styles.tbqCell}>TBQ</em>
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
                    Total: <strong>{totalCartQty} carton{totalCartQty !== 1 ? "s" : ""}</strong>
                  </span>
                  {totalCartQty < MIN_ORDER_CARTONS && (
                    <span className={styles.minOrderWarning}>
                      Minimum {MIN_ORDER_CARTONS} cartons required ({MIN_ORDER_CARTONS - totalCartQty} more needed)
                    </span>
                  )}
                </div>

                <div className={styles.divider} style={{ marginTop: "20px" }} />

                {/* ── Shipment options ── */}
                <div className={styles.shipmentSection}>
                  <p className={styles.shipmentTitle}>Shipment Method *</p>
                  {shipmentError && (
                    <p className={styles.fieldError} style={{ marginBottom: "10px" }}>
                      {shipmentError}
                    </p>
                  )}
                  <div className={styles.shipmentGroups}>
                    {SHIPMENT_OPTIONS.map((group) => (
                      <div key={group.group} className={styles.shipmentGroup}>
                        <p className={styles.shipmentGroupLabel}>{group.group}</p>
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
                </div>

                <div className={styles.btnRow}>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleProceedToPreview}
                    disabled={totalCartQty < MIN_ORDER_CARTONS}
                  >
                    Preview Quotation and Submit →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════ STEP 3 — PREVIEW ══════════════════════════════════════════ */}
          {step === 3 && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Quotation Preview</h2>
                <p>Review your request before we generate the formal document.</p>
              </div>

              <div className={styles.previewDoc}>
                {/* Doc header */}
                <div className={styles.previewDocHeader}>
                  <div>
                    <p className={styles.previewEyebrow}>House of Japanese Curry — B2B</p>
                    <h3 className={styles.previewTitle}>Request for Quotation</h3>
                  </div>
                  <div className={styles.dateBadge}>
                    <span>Submission Date</span>
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
                      <h4 className={styles.previewSectionTitle}>Company Details</h4>
                      <InfoRow label="Company" value={contact.company} />
                      <InfoRow label="Contact" value={contact.name} />
                    </div>
                    <div className={styles.previewSection}>
                      <h4 className={styles.previewSectionTitle}>Contact Information</h4>
                      <InfoRow label="Email" value={contact.email} />
                      <InfoRow label="Phone" value={`${contact.phoneCode} ${contact.phone}`} />
                      <InfoRow
                        label="Shipment"
                        value={`${selectedShipment} — ${SHIPMENT_OPTIONS.find((g) => g.options.includes(selectedShipment))?.group}`}
                      />
                    </div>
                  </div>

                  {/* Products table */}
                  <div className={styles.previewSection}>
                    <h4 className={styles.previewSectionTitle}>Requested Products</h4>
                    <table className={styles.previewTable}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th className={styles.tdCenter}>Qty (cartons)</th>
                          <th className={styles.tdRight}>Unit Price</th>
                          <th className={styles.tdRight}>Subtotal</th>
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
                                {isRetail ? formatIDR(item.pricePerCarton) : "Will be quoted"}
                              </td>
                              <td className={`${styles.tdRight} ${isRetail ? styles.priceCell : styles.tbqCell}`}>
                                {isRetail
                                  ? formatIDR(item.pricePerCarton * item.quantity)
                                  : "TBQ"}
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
                      Upon confirmation, a formal quotation valid until{" "}
                      <strong>{getValidityDate()}</strong> will be sent to{" "}
                      <strong>{contact.email}</strong>.
                    </p>
                  </div>
                </div>

                <div className={styles.previewActions}>
                  <button className={styles.btnOutlineDark} onClick={() => setStep(2)}>
                    ← Edit
                  </button>
                  <button className={styles.btnConfirm} onClick={handleConfirm}>
                    ✓ Confirm &amp; Generate Quotation
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
                <h3>Thank you for submitted!</h3>
                <p>We will get back to you soon.</p>
              </div>
              <div className={styles.goldStripe} />
              <div className={styles.successBody}>
                <div className={styles.quoteNumberBox}>
                  <span>Your Quotation Number</span>
                  <strong>{quoteNumber}</strong>
                </div>
                <p className={styles.successMsg}>
                  A copy of your quotation has been sent to <strong>{contact.email}</strong>.<br />
                  For immediate assistance, kindly reach out to us via WhatsApp.
                </p>
                <div className={styles.successActions}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnWhatsApp}
                  >
                    <FaWhatsapp size={18} />
                    Continue via WhatsApp
                  </a>
                  <button className={styles.btnOutlineDark} onClick={handleReset}>
                    Submit Another RFQ
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
