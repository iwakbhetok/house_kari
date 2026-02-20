import { useState } from "react";
import Head from "next/head";
import styles from '@/styles/Rfq.module.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function RFQPage() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    product: "",
    quantity: "",
    message: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.company) newErrors.company = "Company is required";
    if (!form.name) newErrors.name = "Name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.product) newErrors.product = "Product is required";
    if (!form.quantity || form.quantity <= 0)
      newErrors.quantity = "Quantity must be > 0";

    if (!form.agree) newErrors.agree = "You must agree to policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // send to API or Express endpoint
    console.log("RFQ Submitted:", form);
    alert("RFQ submitted successfully!");

    setForm({
      company: "",
      name: "",
      email: "",
      phone: "",
      product: "",
      quantity: "",
      message: "",
      agree: false,
    });
  };

  return (
    <>
      <Head>
        <title>Request For Quotation</title>
      </Head>

      <div className={styles.wrapper}>
        {/* HERO */}
        <div className={styles.hero}>
          <img src="/images/rfq-hero.webp" alt="RFQ Banner" />
          <div className={styles.heroText}>
            <h1>Request for Quotation</h1>
            <p>Tell us your needs and we will send the best price</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.container}>
          <div className={styles.card}>
            <h2>RFQ Form</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.grid}>
                <Input
                  label="Company Name"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  error={errors.company}
                />

                <Input
                  label="Contact Person"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />

                <Input
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />

                <Input
                  label="Product Name"
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  error={errors.product}
                />

                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  error={errors.quantity}
                />
              </div>

              <div className={styles.full}>
                <label>Notes / Specification</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                />
                <span>I agree to Privacy Policy</span>
              </div>
              {errors.agree && <p className={styles.error}>{errors.agree}</p>}

              <button className={styles.submitBtn}>Submit RFQ</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <input {...props} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
