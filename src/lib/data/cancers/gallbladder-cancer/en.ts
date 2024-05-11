import { type ChatGraph } from '../graph';

const types: ChatGraph = {
	content:
		'There are Six different types of Gallbladder Cancer. Please select a type to know more.',
	options: [
		{
			content: 'Adenocarcinomas',
			nextNode: {
				content:
					'This is the most common type of gallbladder cancer, making up about 90% of all cases. Adenocarcinomas start in the glandular cells lining the inside of the gallbladder.',
				options: []
			}
		},
		{
			content: 'Papillary Adenocarcinoma',
			nextNode: {
				content:
					'A subtype of adenocarcinoma, this type tends to not spread as quickly to the liver or lymph nodes, which may result in a better prognosis compared to other forms of gallbladder cancer.',
				options: []
			}
		},
		{
			content: 'Squamous Cell Carcinoma',
			nextNode: {
				content:
					'These cancers begin in the squamous cells, which are flat, skin-like cells that may line parts of the gallbladder.',
				options: []
			}
		},
		{
			content: 'Adenosquamous Carcinoma',
			nextNode: {
				content: 'This type contains both gland-like and squamous cell characteristics.',
				options: []
			}
		},
		{
			content: 'Small Cell Carcinoma',
			nextNode: {
				content: 'A less common type that tends to grow and spread more quickly.',
				options: []
			}
		},
		{
			content: 'Sarcoma',
			nextNode: {
				content: 'Originates in the muscle or connective tissue of the gallbladder.',
				options: []
			}
		}
	]
};

const stages: ChatGraph = {
	content: 'What stage of Gallbladder cancer would you like to know about?',
	options: [
		{
			content: 'Stage 0',
			nextNode: {
				content:
					"Carcinoma in Situ. At this stage, abnormal cells are found in the innermost layer of tissue lining the gallbladder but they haven't spread. It's rarely diagnosed at this stage.",
				options: []
			}
		},
		{
			content: 'Stage I',
			nextNode: {
				content: `Cancer is present in the gallbladder wall's inner layers. Stage I is divided into:
- IA (limited to the innermost layers)
- IB (has spread to the next layer).`,
				options: []
			}
		},
		{
			content: 'Stage II',
			nextNode: {
				content:
					'The cancer has grown through the muscle layer and possibly into the outer layer of the gallbladder but has not spread to nearby organs or lymph nodes.',
				options: []
			}
		},
		{
			content: 'Stage III',
			nextNode: {
				content: `This stage is divided into:
- IIIA (cancer has grown through the outer layer and may have spread to nearby organs or structures)
- IIIB (cancer has spread to nearby lymph nodes but not to distant sites).`,
				options: []
			}
		},
		{
			content: 'Stage IV',
			nextNode: {
				content: `The most advanced stage of gallbladder cancer, indicating that the cancer has spread to distant organs or tissues. Stage IV is subdivided into: 
- IVA (spread to main blood vessels or organs near the gallbladder)
- IVB (spread to distant organs or lymph nodes).`,
				options: []
			}
		}
	]
};

const tests: ChatGraph = {
	content: 'I found a few tests related to Gallbladder Cancer. Could you please select one?',
	options: [
		{
			content: 'Blood Tests',
			nextNode: {
				content: `#### Blood Tests
- Liver Function Tests (LFTs): Checks levels of enzymes and proteins like ALT, AST, bilirubin, and albumin. Abnormal levels can signal liver issues.
- Alpha-fetoprotein (AFP) Test: High AFP levels often point to liver cancer, particularly hepatocellular carcinoma (HCC).
- Complete Blood Count (CBC): Crucial for spotting anaemia, infections, and other blood concerns.
- Clotting Tests (like PT): Evaluates the liver’s clotting factor production.
- Kidney Function Tests: Important because liver disease and treatments can impact kidney health.`,
				options: []
			}
		},
		{
			content: 'Imaging Tests',
			nextNode: {
				content: `#### Imaging Tests - A Closer Look

- Ultrasound: The go-to for initial liver cancer screening; great for spotting liver changes and guiding biopsies.
- CT Scan: Offers detailed liver images, crucial for understanding tumour size, number, and location, and for surgical planning.
- MRI: Tops in soft tissue contrast, differentiating between benign and malignant liver lesions, and aiding in surgical decisions.
- PET Scan: Often paired with a CT scan, it's key in finding active cancer cells and checking for cancer spread.
- Contrast-Enhanced Ultrasound (CEUS): Boosts standard ultrasound’s effectiveness in characterising liver lesions.
- Angiography: Invaluable for mapping liver blood vessels, essential in planning certain treatments like TACE.
- Liver Elastography: Non-invasively gauges liver fibrosis and cirrhosis risks.
- Bone Scan: Used if bone metastases are suspected.`,
				options: []
			}
		},
		{
			content: 'Biopsy Techniques',
			nextNode: {
				content: `#### Biopsy Techniques - Confirming Diagnosis

- Percutaneous Needle Biopsy: Minimally invasive, often the first choice; extracts tissue for analysis.
- Fine Needle Aspiration (FNA): Less invasive, good for differentiating lesion types.
- Core Needle Biopsy: Provides a comprehensive tissue sample for detailed analysis.
- Laparoscopic Biopsy: Offers direct liver and tumour visualisation, suitable for hard-to-reach lesions.
- Transjugular Biopsy: Ideal for patients with bleeding risks.
- Surgical Biopsy: Yields ample tissue for analysis, especially during tumour removal.
- Image-Guided Biopsy: Increases accuracy in targeting tumours.`,
				options: []
			}
		},
		{
			content: 'Genetic and Molecular Testing',
			nextNode: {
				options: [],
				content: `Genetic and Molecular Testing - Tailoring Treatment

- Next-Generation Sequencing (NGS): A comprehensive genomic analysis, aiding in targeted therapy decisions.
- PCR, FISH, and IHC: These tests detect specific mutations, chromosomal abnormalities, and proteins in tumour cells.
- Circulating Tumour DNA (ctDNA) Testing: Offers a non-invasive peek into tumour genetics.
- Gene Expression and MicroRNA Profiling: Sheds light on liver cancer subtypes and potential biomarkers.
- Proteomic Analysis and Pharmacogenomics: Identify therapeutic targets and predict drug response.`
			}
		},
		{
			content: 'Additional Diagnostic Procedures',
			nextNode: {
				options: [],
				content: `#### Additional Diagnostic Procedures

- Endoscopic Tests (ERCP, EUS): Useful for bile duct tumours and biopsy guidance.
- Liver Angiography and Laparoscopy: Provide clear visuals of the liver and blood supply.
- Pulmonary and Cardiac Evaluations: Assess fitness for surgery.
- Staging Tests: Combine various test results to gauge cancer extent and spread.
- Other Tests (Chest X-ray, Bone Scan, etc.): Check for metastases and patient's overall health.
				`
			}
		}
	]
};

const emergencyMedications: ChatGraph = {
	content: `
#### Emergency medicines for common side effects while on chemotherapy

<div style="background: #fef9c3; padding: 1rem; border-radius: 0.5rem">Please note that this is not a replacement for professional advice - these medicines are listed as a suggested first aid until you can access medical care from the primary physician overseeing your treatment. Indicated dosing is based on average weight of 60 kg and you may need different dosing based on your weight / age / symptoms.</div>

**Nausea/Vomiting**
- Tab Ondansetron 8 mg twice daily
- Tab Metoclopramide 10 mg thrice daily
- Tab Domperidone-MD under the tongue thrice daily in case unable to take the above
 
**Diarrhea**
- Cap Loperamide 2 mg every 6 hrs
- Probiotic curd also helps

**Fever/flu like Symptoms**
- Tab Paracetamol 650 mg - may be repeated every 6 hrs
- If you have fever (> 100.4 F) while on chemotherapy it may be an indication of infection. It is advisable to get in touch with the treating oncologist to determine if urgent antibiotics are needed.
 
**Rashes**
- Tab Levocetrizine 5 mg twice daily if itching
- Lactocalamine lotion application twice daily

**Neuropathy**
- Tab Duloxetine 30 mg once daily at bedtime
 
**Constipation**
- Syp Lactulose 20 ml daily at bedtime
 
**Mouth ulcers**
- Choline salicylate+Banzalkonium chloride gel
- Benzydamine mouth wash thrice daily
 
**High BP**
- Tab Amlodipine 5 mg once daily
 
**Insomnia**
- Tab Zolpidem 5 mg once daily at bedtime

**High blood sugar**
- Consult doctor
 
**Swelling in face/hands/legs**
- Tab Frusemide 10 mg twice daily
- High protein diet
`,
	options: []
};

const treatments: ChatGraph = {
	content:
		"Here's a list of most common treatment options available in India. Please select an option to know more.",
	options: [
		{
			content: 'Stage I & II',
			nextNode: {
				content: `
1. Surgical Options:
	- **Resection**: This involves removing the part of the liver with cancer. It's most effective for patients in the early stages of liver cancer who have good liver function.
	- **Liver Transplant**: A more extensive procedure where the diseased liver is replaced    with a healthy one from a donor. This is particularly beneficial for certain types of early-stage liver cancers, especially in patients who also suffer from liver diseases like cirrhosis.

2. Local Treatments:
	- **Radiofrequency Ablation (RFA)**: This technique uses electric currents to generate heat and destroy cancer cells.
	- Microwave Ablation: Similar to RFA, but uses microwaves to heat and kill cancer cells.
	- **Cryoablation**: Freezes and destroys cancer cells.
	- Embolization Therapies: These include methods like Transarterial chemoembolization (TACE) and Transarterial radioembolization (TARE or Y90), which cut off the tumour's blood supply. They may also deliver chemotherapy or radioactive particles directly to the tumour.
				
3. Radiation Therapy:
	- **External Beam Radiation**: Targets the cancer from outside the body using radiation.
	- **Stereotactic Body Radiation Therapy (SBRT)**: A precise, high-dose radiation treatment.`,
				options: []
			}
		},
		{
			content: 'Stage III(A, B, C) & IV',
			nextNode: {
				content: `
1. Systemic Treatments:

	- **Chemotherapy**: Uses drugs to kill or halt the growth of cancer cells. It's often the go-to option when the cancer has spread beyond the liver.
	- **Targeted Therapy**: These drugs specifically attack the cancer cells' ability to grow and spread. An example is Sorafenib, commonly used in treating liver cancer. 
	- **Immunotherapy**: Employs drugs that boost the immune system's ability to combat cancer, like checkpoint inhibitors nivolumab and pembrolizumab.

2. Supportive Care:

	- **Pain Management**: Involves using medications and other techniques to alleviate pain and enhance the quality of life.
	- Nutritional Support: Focuses on a diet plan that helps maintain strength and energy.
	- **Psychological Support**: Provides mental health care through counselling or support groups.

3. Clinical Trials:

	- Patients might also consider participating in clinical trials to access new, experimental treatments [here](https://clinicaltrials.gov/)`,
				options: []
			}
		}
	]
};

const activeSymptoms: ChatGraph = {
	content: 'Please select the type of symptoms you are experiencing.',
	options: [
		{
			content: 'Disease-related',
			nextNode: {
				content: `
1. **Jaundice**: Yellowing of the skin and eyes, often one of the most noticeable signs, indicating bile duct obstruction. Signs include dark urine, pale stools, and itching.
2. **Abdominal Pain**: Pain or discomfort, particularly in the upper right abdomen. May radiate to the back or shoulder.
3. **Bloating or Abdominal Swelling**: Could indicate fluid accumulation (ascites) or tumour growth. The abdomen may feel tight or distended.
4. **Fever or Chills**: Can suggest an infection, such as cholangitis, especially if bile ducts are blocked. High temperature and shaking might occur.
5. **Itching (Pruritus)**: Due to the buildup of bile salts in the skin. Skin may appear red or irritated.
6. **Changes in Stool**: Pale, greasy, or clay-colored stools. Indicates a lack of bile in the intestines.
7. **Weight Loss and Appetite Loss**: Unintended weight loss without trying. May feel full quickly or have no desire to eat.
8. **Fatigue**: Persistent tiredness not relieved by rest.
9. **Sepsis**: Sepsis is a serious complication of an infection that can be triggered by cancer-related infections or as a side effect of chemotherapy, which can weaken the immune system. It’s vital to recognise the signs early:

- High fever or very low body temperature: A significant change in body temperature is often an early sign of sepsis.
- Increased heart rate: A heart rate higher than 90 beats per minute.
- Rapid breathing: A respiratory rate higher than 20 breaths per minute.
- Possible confusion or disorientation: Sepsis can affect mental status, leading to changes in alertness or confusion.
- Extreme pain or discomfort: Often described as the worst pain ever experienced.
- Edema or swelling: Due to fluid imbalance and systemic response to infection.
- Pale or discolored skin: May appear as a sign of poor circulation.
- Low urine output: A sign that the kidneys may not be functioning properly due to sepsis.
				`,
				options: []
			}
		},
		{
			content: 'Chemotherapy-related',
			nextNode: {
				content: `
Please use medicine prescribed as per your oncologist for immediate first aid.

1. **Nausea and Vomiting**: Reaction to the drugs used in chemotherapy. May occur hours to days after treatment.
2. **Mucositis**: Inflammation and soreness in the mouth, throat, or esophagus. Signs include redness, swelling, or ulcers in the mouth.
3. **Diarrhea**: Chemotherapy can disrupt the lining of the intestine. Frequent, loose, or watery stools.
4. **Peripheral Neuropathy**: Damage to the peripheral nerves causing weakness, numbness, or pain in the hands and feet. Tingling or burning sensation, sensitivity to temperature or touch.
5. **Hair Loss (Alopecia)**: Some chemotherapy drugs can cause hair to thin or fall out. Can affect the scalp, eyebrows, eyelashes, and body hair.
6. **Low Blood Cell Counts**: Chemotherapy can affect the bone marrow’s ability to produce blood cells.
7. **Anemia (low red blood cells)**: Fatigue, dizziness.
8. **Neutropenia (low white blood cells)**: Increased risk of infection.
9. **Thrombocytopenia (low platelets)**: Easy bruising, bleeding.
10. **Skin and Nail Changes**: Changes in skin color, dry skin, rashes, or nail discoloration. Nails may become brittle or develop lines.
				`,
				options: []
			}
		}
	]
};

const dietCharts: ChatGraph = {
	content: 'Please select the appropriate diet-chart based on your location: ',
	options: [
		{ content: `<a href="/pdfs/diet-charts/assam.pdf" target="_blank">Assam</a>` },
		{ content: `<a href="/pdfs/diet-charts/bihar.pdf" target="_blank">Bihar</a>` },
		{ content: `<a href="/pdfs/diet-charts/chattisgarh.pdf" target="_blank">Chattisgarh</a>` },
		{ content: `<a href="/pdfs/diet-charts/delhi.pdf" target="_blank">Delhi</a>` },
		{ content: `<a href="/pdfs/diet-charts/kashmir.pdf" target="_blank">Kashmir</a>` },
		{ content: `<a href="/pdfs/diet-charts/punjab.pdf" target="_blank">Punjab</a>` },
		{ content: `<a href="/pdfs/diet-charts/uttar-pradesh.pdf" target="_blank">Uttar Pradesh</a>` },
		{ content: `<a href="/pdfs/diet-charts/uttarakhand.pdf" target="_blank">Uttarakhand</a>` },
		{ content: `<a href="mailto:jaruratcare@gmail.com&subject=Request%20diet-chart%20for%20[state%20name]" target="_blank">My State is not Listed</a>` },
	]
}

export const gallbladderEn: ChatGraph = {
	content: 'What would you like to know about Gallbladder Cancer?',
	options: [
		{ content: 'Types', nextNode: types },
		{ content: 'Stages', nextNode: stages },
		{ content: 'Medical Tests', nextNode: tests },
		{ content: 'Treatment Options (in India)', nextNode: treatments },
		{ content: 'Emergency Medications', nextNode: emergencyMedications },
		{ content: 'Active Symptoms Management', nextNode: activeSymptoms },
		{ content: 'Diet Charts', nextNode: dietCharts },
		{ content: '<a href="/pdfs/emotional-wellbeing-for-caregivers-english.pdf" target="_blank">Emotional well-being</a>' },
	]
};
