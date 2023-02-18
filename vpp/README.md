# Software Engineering Project 2022-2023

#### __Group__
SoftEng2022-01
#### __Members__
* el19005 - Δημήτριος Γεωργούσης
* el19062 - Γεώργιος-Αλέξιος Καπετανάκης

## Description
The documentation was produced by Visual Paradigm, but uses custom XML
templates and a Fill-In Doc (Word Document with Doc fields that Visual
Paradigm will Fill-In with appropriate content), so we'll explain how to
recreate our SRS document in Visual Paradigm.

### Software requirements
* Visual Paradigm
* Microsoft Word

### Instructions
* Clone repository wherever you want (e.g. `/`).
* Use only folders/files found in `/vpp`.
* Each folder has been given a name to fit the type of element it refers to.
* You'll need to place the appropriate XML template in the corresponding section of templates in
  Visual Paradigm. To do this, execute the following steps:
1. go to Doc. Composer in Visual Paradigm and try opening the `srs-softeng-01` file then use as a Doc Base our Doc Base which is in the `doc_template` folder.

### If Visual Paradigm cannot create our document, it is because you do not have our XML templates. To install them follow the steps bellow

2. in the GitHub repo open some folder. e.g. The `Project` folder.
3. On the `Diagram Navigator` or the `Model Explorer` in Visual Paradigm click on the corresponding element to the GitHub folder `Name` you opened. For our example
   it's the `Project` Element (will be the root of all elements in `Diagram Navigator` screen) this will show all templates that refer to that element,
   which in this example is `Project`.
4. Execute the following steps:
   1. In Visual Paradigm create a new XML template (e.g. by duplicating an existing and changing its name and content)
   with the same name as one of the files in the GitHub folder and the same content as the corresponding file.
   2. repeat for all files it the folder.
5. Repeat for all folders  in the `/vpp` directory (excluding `doc_template`).

* For each of our folders you'll need to add the xml templates as described above in the following elements in Visual Paradigm
  (We explain how to find a Visual Paradigm element based on the Github folder name).
  
* Folder: `Project` was explained in the example
* Folder: `Component`, Visual Paradigm: Find a component e.g. navigate to `Model Explorer/User Device/Web Browser`.
* Folder: `Use Case Diagram`, Visual Paradigm: Find a Use Case Diagram e.g. navigate to `Diagram Navigator/Use Case Diagram/All Use Cases`.
* Folder: `Actor`, Visual Paradigm: Find an Actor e.g. navigate to `Model Explorer/Χρήστες/Απαντών`.
* Folder: `Interaction Diagram`, Visual Paradigm: Find a Sequence Diagram e.g. navigate to `Diagram Navigator/Sequence Diagram/Answer Questionnaire Sequence`.
* Folder: `Class`, Visual Paradigm: Find a Class e.g. navigate to `Model Explorer/Database Schema/Questionnaire`.
* Folder: `Use Case`, Visual Paradigm: Find a Use Case e.g. navigate to `Model Explorer/Answer Questionnaire`.
