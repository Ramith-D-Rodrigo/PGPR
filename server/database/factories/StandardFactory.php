<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Standard>
 */
class StandardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
        ];
    }
    //the following standard informations have been taken from the manual for PGPR

    //criteria 1 standards
    public function standard1_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.1',
                'criteria_id' => 1,
                'description' => 'The goals and objectives of the prgrammes of study offered by the PGPP are aligned with its strategic plan',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.2',
                'criteria_id' => 1,
                'description' => 'The organizational structure of the PGPP compiles with relevant legislation and regulations',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.3',
                'criteria_id' => 1,
                'description' => 'The organizational structure of the PGPP and the PGPMU is designed to ensure efficient and effective management of its programmes of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.4',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated human resource development policy which includes appointment of suitably qualified teaching faculty and other staff, orientation, professional development, and periodic evaluation of its staff.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.5',
                'criteria_id' => 1,
                'description' => 'Appropriate channels of communication between the PGPP, the PGPMU, teachers, and students, are established officially, and function in a timely manner.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.6',
                'criteria_id' => 1,
                'description' => ' The PGPP has clearly stated policies and effective mechanisms for management of its financial, physical, and human resources, and allocates the resources in accordance with the stated policy.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.7',
                'criteria_id' => 1,
                'description' => 'The PGPP has established mechanisms to entertain student views and representation on matters related to the programme of study and the learning environment, and addresses these concerns in a timely manner.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.8',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy that requires compliance with the guidelines and standards prescribed in the Sri Lanka Qualifications Framework (SLQF) in designing and development of curricula of study programmes and courses.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.9',
                'criteria_id' => 1,
                'description' => 'The PGPP’s policy on curriculum design and development requires the use of an outcome-based approach, and periodic review of the curriculum.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.10',
                'criteria_id' => 1,
                'description' => 'The PGPP and PGPMU have mechanisms in place to ensure that curriculum design and development are outcome-based and subject to periodic review.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.11',
                'criteria_id' => 1,
                'description' => 'The PGPP/ PGPMU publishes up-to-date essential information regarding the programme/s of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.12',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy that requires its programmes of study to be completed within a defined time period, and effective mechanisms are in place to monitor and ensure their timely completion.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.13',
                'criteria_id' => 1,
                'description' => 'The PGPP has a policy that requires clearly defined, transparent, non-discriminatory admission criteria, which are made known to prospective students, and the PGPMU adheres to this policy in the selection of students to the programme/s of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.14',
                'criteria_id' => 1,
                'description' => 'The PGPMU conducts an appropriately structured orientation programme for all new entrants to programmes of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }


    public function standard1_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.15',
                'criteria_id' => 1,
                'description' => 'The PGPP maintains up to date organized filing system/MIS with effective separation of the management of academic activities and key administrative functions, and with clearly defined access rights with provision for secure backups of all files and records.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_16(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.16',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy and mechanism on internal quality assurance with well-defined operational procedures that are implemented by the PGPP and PGPMU to ensure the quality of its educational programmes.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_17(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.17',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy for phasing out curricula and facilitating transition of students, and PGPMU phases out the curriculum of a programme of study with minimum disruption to progression of students and enabling smooth transition of students.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_18(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.18',
                'criteria_id' => 1,
                'description' => 'The PGPP has a code of conduct for students/ student charter/ learning contract, and PGPMU ensures that students are aware of their responsibilities and adhere to the students’ code of conduct.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_19(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.19',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy on management of student grievances and the PGPP/PGPMU has a published mechanism for receiving student complaints and handles such complaints appropriately.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_20(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.20',
                'criteria_id' => 1,
                'description' => 'The PGPP has a sound financial management system that complies with national guidelines and enables the PGPMU to continue delivery of the study programmes without hindrance.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_21(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.21',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy and established mechanisms to offer support for students with special needs.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_22(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.22',
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly stated policy and practices on GEE and SGBV and PGPMU implements measures to ensure GEE and deter any form of SGBV amongst all categories of staff and students. ',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard1_23(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '1.23',
                'criteria_id' => 1,
                'description' => 'The PGPP has a Management Guide that sets out all the procedures adopted by the PGPP/ PGPMU for the implementation of its policies, and the Management Guide is used by the PGPMU to ensure efficient and effective management of the programme of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }


    //criteria 2

    public function standard2_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.1',
                'criteria_id' => 2,
                'description' => 'Programme conforms to the mission, goals and objectives of the PGPP.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.2',
                'criteria_id' => 2,
                'description' => 'PGPMU ensures that curriculum review and design processes are guided by a formal needs analysis which includes input from employer/ professional body surveys, addresses national needs, reflects global trends, and current knowledge and practice, which is followed by programme development with external stakeholder participation.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.3',
                'criteria_id' => 2,
                'description' => 'PGPMU effectively communicates matters related to design and development of the programme of study with relevant faculty members, current students, alumni, employers and relevant professional, industry and community bodies.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.4',
                'criteria_id' => 2,
                'description' => 'Programme is designed or revised by a curriculum design and development committee of experts or PGPMU and approved by the PGPP with clearly defined tasks and procedural frameworks.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.5',
                'criteria_id' => 2,
                'description' => 'The members of the PGPMU, in terms of the number, qualifications and competencies is adequate for designing and development of the study programmes.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.6',
                'criteria_id' => 2,
                'description' => 'Programme is designed conforming to the “Purpose and Scope of Qualification” requirement of the appropriate SLQF Level.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.7',
                'criteria_id' => 2,
                'description' => 'Graduate profile of the programme is aligned with the “Attributes of Qualification Holders” requirement of the appropriate SLQF Level.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.8',
                'criteria_id' => 2,
                'description' => 'Programme complies with the “Minimum Admission Requirement” for the appropriate SLQF Level.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.9',
                'criteria_id' => 2,
                'description' => 'Programme Learning Outcomes (PLOs) are aligned with the 12 SLQF learning outcomes (LOs), and comprehensively address all relevant SLQF Level Descriptors.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.10',
                'criteria_id' => 2,
                'description' => 'The progression of achievement of the 12 SLQF learning outcomes over the duration of the programme is clearly planned and documented.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.11',
                'criteria_id' => 2,
                'description' => 'Programme fulfils the required total volume of learning at the relevant SLQF Level',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.12',
                'criteria_id' => 2,
                'description' => 'Progression opportunities and progression pathways upon successful completion of study programme are clearly stated in the prospectus.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.13',
                'criteria_id' => 2,
                'description' => 'The PGPP and HEI ensure the name of the qualification awarded for the programme complies with the SLQF with respect to the Type, Designator, Qualifier, and the Abbreviation.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.14',
                'criteria_id' => 2,
                'description' => 'Intended Learning Outcomes (ILOs) of each course/module/research, which include latest developments in the field, are clearly mapped with respective PLOs and SLQF Level Descriptors.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.15',
                'criteria_id' => 2,
                'description' => 'Teaching- learning activities are designed to be student-centred, and clearly aligned with assessment tasks and ILOs for each course/module.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_16(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.16',
                'criteria_id' => 2,
                'description' => 'Each individual course/module has a credit value, designated number of study hours (notional hours) which include any combination of direct teaching hours, learning activities, assignments, tutorials, laboratory/clinical work, project work, self-learning, use of library, revision and examinations in compliance with the SLQF.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard2_17(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.17',
                'criteria_id' => 2,
                'description' => 'The PGPMU publishes programme specifications for the study programmes and course specifications for taught courses and research component (where relevant).',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_18(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.18',
                'criteria_id' => 2,
                'description' => 'The programme has the appropriate proportions of taught courses and a research component or guided independent study component, in compliance with the SLQF.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_19(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.19',
                'criteria_id' => 2,
                'description' => 'The research component or the guided independent study component of the programme (when applicable) fulfils the requirements described in the SLQF for the respective level.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_20(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.20',
                'criteria_id' => 2,
                'description' => 'PGPMU uses officially approved standard formats/ templates/ guidelines for programme, course/module design and development and complies with official requirements during the programme design and development phases.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_21(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.21',
                'criteria_id' => 2,
                'description' => 'The PGPMU designs study programmes according to an annual academic calendar (where relevant) that enables the students to successfully complete the programme at the stipulated time.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_22(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.22',
                'criteria_id' => 2,
                'description' => 'Programme approval decisions are taken by the relevant institutional committee after full consideration of design principles, academic standards, and appropriateness of the learning opportunities available, monitoring and review arrangements and content of the programme specification.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_23(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.23',
                'criteria_id' => 2,
                'description' => 'PGPMU uses student feedback for continuous improvement of the programme of study and the student experience.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_24(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.24',
                'criteria_id' => 2,
                'description' => 'PGPMU collects information about students’ progression after graduation and uses it for continuous improvement of the programme.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard2_25(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '2.25',
                'criteria_id' => 2,
                'description' => 'PGPMU uses the results of programme evaluation for the process of curriculum revision.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    //criteria 3

    public function standard3_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.1',
                'criteria_id' => 3,
                'description' => 'The PGPP and PGPMU have sufficient academic, administrative, academic support staff and non-academic staff for efficient execution of the programme and to maintain the academic quality of course delivery and supervision of research.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.2',
                'criteria_id' => 3,
                'description' => 'The PGPMU has mechanisms to make sure that the academic staff who are assigned teaching or research supervision responsibilities carry out the task to completion within the stipulated time period.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.3',
                'criteria_id' => 3,
                'description' => 'The PGPP ensures that all staff of all categories are informed of relevant institutional regulations and procedures including updates.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.4',
                'criteria_id' => 3,
                'description' => 'The PGPP supports Continuous Professional Development and training of its academic, academic support, administrative and non-academic staff',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.5',
                'criteria_id' => 3,
                'description' => 'The PGPP has published pre-approved criteria to evaluate the performance of all categories of staff and a mechanism to regularly monitor their performance.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.6',
                'criteria_id' => 3,
                'description' => 'The PGPP rewards members of staff with outstanding performance.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.7',
                'criteria_id' => 3,
                'description' => 'The PGPP/PGPMU has established guidelines on PG student services that are communicated to all students.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.8',
                'criteria_id' => 3,
                'description' => 'PGPP/PGPMU makes the guidelines on student services available to staff.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.9',
                'criteria_id' => 3,
                'description' => 'The PGPP ensures adherence to guidelines and codes of conduct relevant to student services, by staff.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.10',
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures that learning resources are up-to-date, adequate for all students, and support achievement of programme outcomes by all students',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.11',
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures that students are made aware of and trained (where relevant) for safe engagement in learning activities and research.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.12',
                'criteria_id' => 3,
                'description' => 'The PGPP provides students and teachers with access to a library that is networked and has up-to-date titles in print or electronic media, Open Educational Resources (OER) and data bases that comply with laws pertaining to intellectual property rights.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.13',
                'criteria_id' => 3,
                'description' => 'The library provides students and teachers with services such as interlibrary loans, reprography, reading rooms, wi-fi, electronic access, meeting rooms etc.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.14',
                'criteria_id' => 3,
                'description' => 'The library provides students and staff with facilities to carry out plagiarism checks.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.15',
                'criteria_id' => 3,
                'description' => 'PGPP or PGPMU ensures students and staff have access to adequate computer and internet facilities, essential up-to-date licensed software and friendly technical support.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_16(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.16',
                'criteria_id' => 3,
                'description' => 'The PGPP ensures that students have access to a functional LMS, that is customized by the PGPMU for its programmes of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_17(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.17',
                'criteria_id' => 3, 'description' => 'The PGPMU provides training for staff and students in the use of the LMS',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_18(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.18',
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures access by staff and students to well-equipped and adequate physical facilities for teaching-learning and research activities, both on-site and outside of the PGPP',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_19(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.19',
                'criteria_id' => 3,
                'description' => 'The PGPP maintains well-equipped and adequate physical infrastructure for administrative and non-academic staff',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_20(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.20',
                'criteria_id' => 3,
                'description' => 'The PGPP ensures availability of adequate and well-maintained cafeteria and sanitary facilities for all students and staff, including those with special needs.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_21(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.21',
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures that students and staff with special needs have adequate access to facilities for teaching-learning and research',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    public function standard3_22(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '3.22',
                'criteria_id' => 3,
                'description' => 'The PGPP or PGPMU has a mentoring and counselling system in place to provide students with guidance and support throughout the programme of study.',
                'valid_slqf_levels' => json_encode([
                    "all" //all slqf levels
                ])
            ];
        });
    }

    //criteria 4

    public function standard4_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.1',
                'criteria_id' => 4, 'description' => 'The PGPMU ensures that the conducted programme of study is consistent with detailed programme and course specifications/ research proposal specifications.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels (book has said 7,8,9,10 only but later, 11,12 also have the same definition)
                ])
            ];
        });
    }

    public function standard4_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.2',
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures that teaching-learning and research activities are consistent with and facilitates the achievement of programme learning outcomes by all postgraduate students.',
                'valid_slqf_levels' => json_encode([
                    'all' //(book has said 7,8,9,10 only but later, 11,12 also have the same definition)
                ])
            ];
        });
    }

    public function standard4_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.3',
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures that all postgraduate programmes demand a high level of theoretical engagement through teaching, guided independent study or research in compliance with the Purpose and Scope as outlined in the SLQF requirements.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.4',
                'criteria_id' => 4,
                'description' => 'PGPMU has mechanisms to ensure that all teachers involved in each graduate program are qualified to provide high level of theoretical knowledge or to guide independent study or research projects.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.5',
                'criteria_id' => 4,
                'description' => 'PGPMU ensures that teaching-learning engagement time of students of every course comply with the credit value stated in the course curriculum and notional hours specified in the SLQF.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.6',
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures that every course unit or module in a programme of study has a detailed course syllabus or plan that sets out the weekly schedule of activities that are aligned with the course ILOs.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.7',
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures that all students are made aware of the specified course or module plan and the course ILOs at the commencement of the course unit or module',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.8',
                'criteria_id' => 4,
                'description' => 'The PGPMU has a mechanism to ensure that every teacher adheres to the specified course or module plan.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.9',
                'criteria_id' => 4,
                'description' => 'The PGPMU has mechanisms to obtain feedback from peers and students on teaching-learning and research activities',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.10',
                'criteria_id' => 4,
                'description' => 'The PGPMU uses feedback from peers and students to improve the quality of teaching-learning and research activities.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.11',
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures effective use of both electronic and online media as well as face-to-face teaching-learning activities in every program of study',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard4_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.12',
                'criteria_id' => 4,
                'description' => 'PGPP has mechanisms to ensure adherence to honesty, academic integrity, and ethical conduct by staff and students in all areas of teaching-learning and research.',
                'valid_slqf_levels' => json_encode([
                    '7', '8', '9', '10' //only for levels 7, 8, 9, 10
                ])
            ];
        });
    }

    public function standard_4_3_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.3',
                'criteria_id' => 4,
                'description' => 'PGPMU ensures that mechanisms are in place to provide every student who undertakes research or Practice-based programmes with relevant structured training that facilitate compliance with the Purpose and Scope as outlined in the SLQF requirements',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_4_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.4',
                'criteria_id' => 4,
                'description' => 'PGPMU ensures the appointment of supervisors with equivalent or higher qualifications than the qualification sought by the student as stated in the SLQF.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_5_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.5',
                'criteria_id' => 4,
                'description' => 'The PGPMU and supervisor ensure that duration of research engagement of every student complies with the minimum prescribed time requirement for the relevant qualification.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_6_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.6',
                'criteria_id' => 4,
                'description' => 'PGPMU has a mechanism in place to accept students for research degrees after the scrutiny of referrals and the nominated supervisor assures in writing that he/she made a preliminary assessment of the prospective student, and that the student has the potential competencies to undertake the proposed research project.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_7_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.7',
                'criteria_id' => 4,
                'description' => 'PGPMU ensures that only those with active track records of research are appointed as chief supervisors of students in research degree programs.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_8_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.8',
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures that the research plan is developed by the PG student in consultation with the appointed supervisor/s, and is formally approved by the Senate or BoM prior to commencement of the project',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_9_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.9',
                'criteria_id' => 4,
                'description' => 'The PGPP has a mechanism to ensure that the supervisor regularly monitors students and documents their progress and takes remedial action, where necessary to ensure implementation of the research plan.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_10_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.10',
                'criteria_id' => 4,
                'description' => 'The supervisor supports students to access relevant subject experts/ resource persons / facilities and resources within and outside of the PGPP.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_11_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.11',
                'criteria_id' => 4,
                'description' => 'The PGPMU has mechanisms in place to facilitate students to complete the research degree as originally planned without undue delays or with approved amendments.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_12_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.12',
                'criteria_id' => 4,
                'description' => 'PGPMU uses occasions of progress review meetings and thesis defence as opportunities for obtaining independent and external peer review to assess the quality of supervision and research',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_13_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.13',
                'criteria_id' => 4,
                'description' => 'PGPP has mechanisms to ensure adherence to honesty, academic integrity, and ethical conduct by staff and students in all areas of teaching-learning and research.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_14_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.14',
                'criteria_id' => 4,
                'description' => 'PGPP has clear policies on research ethics including plagiarism and innovation, patents and Intellectual Property Rights (IPR) and ensures that students and staff are aware of those policies.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    public function standard_4_15_b(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '4.15',
                'criteria_id' => 4,
                'description' => 'The PGPP/ PGPMU ensures that postgraduate students and staff adhere to ethical guidelines, intellectual property rights and authorship criteria.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }

    //criteria 5
    public function standard5_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.1',
                'criteria_id' => 5,
                'description' => 'PGPP has an approved assessment framework that encompasses an effective procedure for the conduct of examinations and award of qualifications.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.2',
                'criteria_id' => 5,
                'description' => 'The assessment strategies adopted by the study program are aligned to the relevant Level descriptors of the SLQF, and where available, the requirements of the relevant professional bodies and nationally approved benchmarks.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.3',
                'criteria_id' => 5,
                'description' => 'The PGPP monitors, reviews and updates its regulations on assessments periodically, adhering to the approved process, to ensure fitness for purpose.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.4',
                'criteria_id' => 5,
                'description' => 'The PGPMU has mechanisms to ensure adherence to the approved regulations and procedures on assessments by the relevant staff, and reviews and updates the program assessment strategies periodically, to ensure fitness for purpose.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.5',
                'criteria_id' => 5,
                'description' => 'The PGPP has approved criteria and established procedures related to award of qualification/s, including recognition of meritorious performance of students, where applicable, which are reviewed and updated as required',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.6',
                'criteria_id' => 5,
                'description' => 'The PGPMU publishes and communicates the approved criteria related to assessment and award of qualifications and recognition of meritorious performance of students in a timely manner to all candidates and staff.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.7',
                'criteria_id' => 5,
                'description' => 'The PGPMU adheres to approved criteria and established procedures for the award of qualifications and recognition of meritorious performance of students.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.8',
                'criteria_id' => 5,
                'description' => 'The PGPP has established guidelines to ensure that assessments are conducted with rigor, honesty, transparency and fairness and with due regard to confidentiality and integrity, and the PGPMU ensures that staff involved with examinations are made aware of these guidelines and adhere to them at all times.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard5_9(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.9',
                'criteria_id' => 5,
                'description' => 'The PGPP ensures that all decisions related to assessments and awards are documented accurately and systematically.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_10(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.10',
                'criteria_id' => 5,
                'description' => 'The PGPP has a clearly defined policy of disclosure on the level of details of assessment outcomes that are made available to the students and other specified parties, and PGPMU ensures implementation of the policy.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_11(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.11',
                'criteria_id' => 5,
                'description' => 'The PGPP has regulations that stipulate the criteria and procedure for nomination and appointment of both internal and external examiners and the first and second examiners, and appointment of examiners under special situations, and the PGPMU implements these regulations accordingly',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_12(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.12',
                'criteria_id' => 5,
                'description' => 'The PGPP maintains a regularly updated database / registry of eligible examiners that includes their qualifications, specializations, affiliations and experience, and the PGPMU nominates examiners from the database ensuring regular rotation of examiners',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_13(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.13',
                'criteria_id' => 5,
                'description' => 'The PGPMU ensures that selected examiners possess no conflicts of interest with respect to examination of candidates',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_14(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.14',
                'criteria_id' => 5,
                'description' => 'The services of the examiners nominated by the PGPMU are obtained following the approval of PGPP and the HEI.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_15(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.15',
                'criteria_id' => 5,
                'description' => 'The PGPP has established disciplinary procedures for handling examination malpractices, and ensures its strict enforcement',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_16(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.16',
                'criteria_id' => 5,
                'description' => 'The PGPMU and PGPP use the approved formats and templates to document the results of assessment, including the official transcript.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_17(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.17',
                'criteria_id' => 5,
                'description' => 'The HEI establishes a smooth and efficient procedure for issuing and authenticating official transcripts at the request of the students, other HEIs or employers.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_18(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.18',
                'criteria_id' => 5,
                'description' => 'The PGPMU ensures that the ‘Schedule of Assessment’ is made known to the students at the beginning of a course / module / program of research.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_19(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.19',
                'criteria_id' => 5,
                'description' => 'The PGPMU ensures that students are provided with regular, appropriate and timely feedback on formative assessments in compliance with the Schedule of Assessment.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_20(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.20',
                'criteria_id' => 5,
                'description' => 'The PGPP and PGPMU ensure that the final results of a course/ module are released within three months from the date of examination and where applicable, Thesis / Dissertation / Research Project defense examination is conducted within six months of the date of submission of the Thesis / Dissertation / Research Report',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_21(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.21',
                'criteria_id' => 5,
                'description' => 'The PGPP has established procedures to handle students’ complaints and academic appeals in a fair and effective manner without risk of disadvantage, and the PGPP promptly deals with them, and deliver timely responses',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_22(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.22',
                'criteria_id' => 5,
                'description' => 'The PGPMU ensures that assessment tasks and tools used are valid, reliable, and appropriately weighted to measure the level of achievement of the desired ILOs.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_23(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.23',
                'criteria_id' => 5,
                'description' => 'The PGPP and PGPMU ensure that the facilities used for examinations and other assessments are appropriate, secure and comfortable (e.g., spacious, quiet) and include basic sanitary facilities.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard5_24(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '5.24',
                'criteria_id' => 5,
                'description' => 'The PGPP and PGPMU ensure that appropriate arrangements / adjustments / facilities are made available to provide the students with special needs with the same opportunity as their peers to demonstrate the achievement of learning outcomes.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    //criteria 6

    public function standard6_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.1',
                'criteria_id' => 6,
                'description' => 'The PGPP has a clearly stated policy and a clear plan for systematic internal evaluation of its programmes of study',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.2',
                'criteria_id' => 6,
                'description' => 'The PGPMU uses a variety of tools for internal evaluation of its programmes of study including the process of delivery and the achievement of specified programme learning outcomes.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.3',
                'criteria_id' => 6,
                'description' => 'The PGPMU uses the results of internal programme evaluation to remedy perceived gaps and deficiencies in programme management including allocation of resources and learner support, as well as programme design and development, teaching-learning and research activities and assessment.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.4',
                'criteria_id' => 6,
                'description' => 'The PGPP maintains up-to-date data on applicants, completion rates, time to graduation, and graduate destinations',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.5',
                'criteria_id' => 6,
                'description' => 'The PGPMU periodically evaluates the records maintained by the PGPP on its students and graduates to identify completion rates, time to graduation, and graduate destinations and takes necessary remedial action',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.6',
                'criteria_id' => 6,
                'description' => 'The PGPP and PGPMU ensure the standard of academic outputs of students prior to dissemination.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_7(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.7',
                'criteria_id' => 6,
                'description' => 'The PGPMU maintains records of outputs resulting from graduate work carried out by registered students, periodically evaluates them and takes appropriate remedial action where necessary.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard6_8(): Factory{
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.8',
                'criteria_id' => 6,
                'description' => 'The PGPP or PGPMU encourages securing of research grants or other means of external funding to support student research and maintains up-to-date records of the number and value of research funding secured',
                'valid_slqf_levels' => json_encode([
                    '10', '11', '12'
                ])
            ];
        });
    }

    public function standard6_9(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.9',
                'criteria_id' => 6,
                'description' => 'The PGPP has mechanisms in place to accommodate concerns raised against conduct of students by stakeholders and implements corrective and preventive measures in a timely manner.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard6_10(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.10',
                'criteria_id' => 6,
                'description' => 'The PGPMU regularly obtains feedback from external examiners regarding the examination process, and analyses it to identify perceived gaps and deficiencies in the examination process, and takes appropriate remedial actions.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard6_11(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.11',
                'criteria_id' => 6,
                'description' => 'PGPMU makes decisions on assessment practices, student learning experiences and outcomes, completion, retention and progression rates and the overall performance of the assessment system using statistical analysis, and takes remedial measures where necessary.',
                'valid_slqf_levels' => json_encode([
                    'all'
                ])
            ];
        });
    }

    public function standard6_12(): Factory {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '6.12',
                'criteria_id' => 6,
                'description' => 'The PGPP ensures that the programmes of study are accredited or recognized by the relevant authorities or professional bodies.',
                'valid_slqf_levels' => json_encode([
                    'all', 'professionl_pg_programme'
                ])
            ];
        });
    }

    //criteria 7

    public function standard7_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.1',
                'criteria_id' => 7,
                'description' => 'PGPP has established a comprehensive centralized MIS which maintains updated information on students and provides secured access to relevant stakeholders.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.2',
                'criteria_id' => 7,
                'description' => 'PGPMU designs the Programmes of study with nested qualifications that are aligned with SLQF requirements and specific details relating to exit pathways, where relevant.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.3',
                'criteria_id' => 7,
                'description' => 'PGPMU designs the Programmes of study with provision for lateral entry and credit transfer options, in compliance with nationally approved requirements, where relevant.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.4',
                'criteria_id' => 7,
                'description' => 'PGPMU integrates multiple opportunities for acquisition of competencies (such as communication, ability to work in a group, project management, entrepreneurship) that improve research and professional skills into design and conduct of the Programme of study.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.5',
                'criteria_id' => 7,
                'description' => "PGPMU ensures the acquisition of research, creative, and professional skills as relevant to the field of study, in parallel with, or as part of, the academic assessment of the student's progress.",
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.6',
                'criteria_id' => 7,
                'description' => 'The PGPP has a student support policy to facilitate successful completion of the programme of study by students, and ensures that students receive such support.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.7',
                'criteria_id' => 7,
                'description' => 'PGPP and PGPMU facilitate students to secure language support services including academic writing, as required',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.8',
                'criteria_id' => 7,
                'description' => 'PGPMU has active collaboration and periodically renewed partnerships with local, national, regional and international organizations and research institutes, that are centres of excellence, to improve the quality and standards of education provision including teaching-learning and research.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.9',
                'criteria_id' => 7,
                'description' => 'The PGPP has established mechanisms to recognize and reward excellence in teaching-learning and mentoring/ supervision.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.10',
                'criteria_id' => 7,
                'description' => 'The PGPP has established mechanisms to recognize and reward excellence in student research/creative practice.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.11',
                'criteria_id' => 7,
                'description' => 'PGPP and PGPMU maintain data on national and international recognitions received for PG student research outputs and recipients are appreciated.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.12',
                'criteria_id' => 7,
                'description' => 'PGPP and PGPMU provide students with opportunities for interdisciplinary learning, where appropriate.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.13',
                'criteria_id' => 7,
                'description' => 'The PGPP encourages admission of international students for its programmes of study and offshore delivery of its programmes',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.14',
                'criteria_id' => 7,
                'description' => 'The PGPP encourages international recognition or accreditation of its programme of study.',
                'valid_slqf_levels' => json_encode([
                    'all' //all slqf levels
                ])
            ];
        });
    }

    public function standard7_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => '7.15',
                'criteria_id' => 7,
                'description' => 'PGPP and PGPMU offer opportunities for or facilitate development of competencies in supervision and guidance of research students.',
                'valid_slqf_levels' => json_encode([
                    '11', '12'
                ])
            ];
        });
    }
}
