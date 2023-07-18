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
                'standard_no' => 1.1,
                'criteria_id' => 1,
                'description' => 'The goals and objectives of the prgrammes of study offered by the PGPP are aligned with its strategic plan',
            ];
        });
    }

    public function standard1_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.2,
                'criteria_id' => 1,
                'description' => 'The organizational structure of the PGPP compiles with relevant legislation and regulations',
            ];
        });
    }

    public function standard1_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.3,
                'criteria_id' => 1,
                'description' => 'The organizational structure
                of the PGPP and the PGPMU is
                designed to ensure efficient and
                effective management of its
                programmes of study.',
            ];
        });
    }

    public function standard1_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.4,
                'criteria_id' => 1,
                'description' => ' The PGPP has a clearly
                stated human resource
                development policy which
                includes appointment of suitably
                qualified teaching faculty and
                other staff, orientation,
                professional development, and
                periodic evaluation of its staff.',
            ];
        });
    }

    public function standard1_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.5,
                'criteria_id' => 1,
                'description' => 'Appropriate channels of
                communication between the
                PGPP, the PGPMU, teachers,
                and students, are established
                officially, and function in a
                timely manner.',
            ];
        });
    }

    public function standard1_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.6,
                'criteria_id' => 1,
                'description' => ' The PGPP has clearly stated
                policies and effective
                mechanisms for management of
                its financial, physical, and
                human resources, and allocates
                the resources in accordance with
                the stated policy.',
            ];
        });
    }

    public function standard1_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.7,
                'criteria_id' => 1,
                'description' => 'The PGPP has established
                mechanisms to entertain student
                views and representation on
                matters related to the
                programme of study and the
                learning environment, and
                addresses these concerns in a
                timely manner.',
            ];
        });
    }

    public function standard1_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.8,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy that requires
                compliance with the guidelines
                and standards prescribed in the
                Sri Lanka Qualifications
                Framework (SLQF) in designing
                and development of curricula of
                study programmes and courses.',
            ];
        });
    }

    public function standard1_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.9,
                'criteria_id' => 1,
                'description' => 'The PGPP’s policy on
                curriculum design and
                development requires the use of
                an outcome-based approach, and
                periodic review of the
                curriculum.',
            ];
        });
    }

    public function standard1_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.10,
                'criteria_id' => 1,
                'description' => 'The PGPP and PGPMU
                have mechanisms in place to
                ensure that curriculum design
                and development are outcome-based and subject to periodic
                review.',
            ];
        });
    }

    public function standard1_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.11,
                'criteria_id' => 1,
                'description' => 'The PGPP/ PGPMU
                publishes up-to-date essential
                information regarding the
                programme/s of study.',
            ];
        });
    }

    public function standard1_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.12,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy that requires its
                programmes of study to be
                completed within a defined time
                period, and effective
                mechanisms are in place to
                monitor and ensure their timely
                completion.',
            ];
        });
    }

    public function standard1_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.13,
                'criteria_id' => 1,
                'description' => 'The PGPP has a policy
                that requires clearly defined,
                transparent, non-discriminatory
                admission criteria, which are
                made known to prospective
                students, and the PGPMU
                adheres to this policy in the
                selection of students to the
                programme/s of study.',
            ];
        });
    }

    public function standard1_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.14,
                'criteria_id' => 1,
                'description' => 'The PGPMU conducts an
                appropriately structured
                orientation programme for all
                new entrants to programmes of
                study.',
            ];
        });
    }


    public function standard1_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.15,
                'criteria_id' => 1,
                'description' => 'The PGPP maintains up to
                date organized filing
                system/MIS with effective
                separation of the management of
                academic activities and key
                administrative functions, and
                with clearly defined access
                rights with provision for secure
                backups of all files and records.',
            ];
        });
    }

    public function standard1_16(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.16,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy and mechanism on
                internal quality assurance with
                well-defined operational
                procedures that are implemented
                by the PGPP and PGPMU to
                ensure the quality of its
                educational programmes.',
            ];
        });
    }

    public function standard1_17(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.17,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy for phasing out
                curricula and facilitating
                transition of students, and
                PGPMU phases out the
                curriculum of a programme of
                study with minimum disruption
                to progression of students and
                enabling smooth transition of
                students.',
            ];
        });
    }

    public function standard1_18(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.18,
                'criteria_id' => 1,
                'description' => 'The PGPP has a code of
                conduct for students/ student
                charter/ learning contract, and
                PGPMU ensures that students
                are aware of their
                responsibilities and adhere to
                the students’ code of conduct.',
            ];
        });
    }

    public function standard1_19(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.19,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy on management of
                student grievances and the
                PGPP/PGPMU has a published
                mechanism for receiving student
                complaints and handles such
                complaints appropriately.',
            ];
        });
    }

    public function standard1_20(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.20,
                'criteria_id' => 1,
                'description' => 'The PGPP has a sound
                financial management system
                that complies with national
                guidelines and enables the
                PGPMU to continue delivery of
                the study programmes without
                hindrance.',
            ];
        });
    }

    public function standard1_21(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.21,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy and established
                mechanisms to offer support for
                students with special needs.',
            ];
        });
    }

    public function standard1_22(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.22,
                'criteria_id' => 1,
                'description' => 'The PGPP has a clearly
                stated policy and practices on
                GEE and SGBV and PGPMU
                implements measures to ensure
                GEE and deter any form of
                SGBV amongst all categories of
                staff and students. ',
            ];
        });
    }

    public function standard1_23(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 1.23,
                'criteria_id' => 1,
                'description' => 'The PGPP has a
                Management Guide that sets out
                all the procedures adopted by
                the PGPP/ PGPMU for the
                implementation of its policies,
                and the Management Guide is
                used by the PGPMU to ensure
                efficient and effective
                management of the programme
                of study.',
            ];
        });
    }


    //criteria 2

    public function standard2_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.1,
                'criteria_id' => 2,
                'description' => 'Programme conforms to the
                mission, goals and objectives of
                the PGPP.',
            ];
        });
    }

    public function standard2_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.2,
                'criteria_id' => 2,
                'description' => 'PGPMU ensures that
                curriculum review and design
                processes are guided by a formal
                needs analysis which includes
                input from employer/ professional
                body surveys, addresses national
                needs, reflects global trends, and
                current knowledge and practice,
                which is followed by programme
                development with external
                stakeholder participation.',
            ];
        });
    }

    public function standard2_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.3,
                'criteria_id' => 2,
                'description' => 'PGPMU effectively
                communicates matters related to
                design and development of the
                programme of study with
                relevant faculty members, current
                students, alumni, employers and
                relevant professional, industry
                and community bodies.',
            ];
        });
    }

    public function standard2_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.4,
                'criteria_id' => 2,
                'description' => 'Programme is designed or
                revised by a curriculum design
                and development committee of
                experts or PGPMU and approved
                by the PGPP with clearly defined
                tasks and procedural frameworks.',
            ];
        });
    }

    public function standard2_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.5,
                'criteria_id' => 2,
                'description' => 'The members of the
                PGPMU, in terms of the number,
                qualifications and competencies
                is adequate for designing and
                development of the study
                programmes.',
            ];
        });
    }

    public function standard2_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.6,
                'criteria_id' => 2,
                'description' => ' Programme is designed
                conforming to the “Purpose and
                Scope of Qualification”
                requirement of the appropriate
                SLQF Level.',
            ];
        });
    }

    public function standard2_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.7,
                'criteria_id' => 2,
                'description' => 'Graduate profile of the
                programme is aligned with the
                “Attributes of Qualification
                Holders” requirement of the
                appropriate SLQF Level.',
            ];
        });
    }

    public function standard2_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.8,
                'criteria_id' => 2,
                'description' => 'Programme complies with
                the “Minimum Admission
                Requirement” for the appropriate
                SLQF Level.',
            ];
        });
    }

    public function standard2_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.9,
                'criteria_id' => 2,
                'description' => 'Programme Learning
                Outcomes (PLOs) are aligned
                with the 12 SLQF learning
                outcomes (LOs), and
                comprehensively address all
                relevant SLQF Level
                Descriptors.',
            ];
        });
    }

    public function standard2_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.10,
                'criteria_id' => 2,
                'description' => 'The progression of
                achievement of the 12 SLQF
                learning outcomes over the
                duration of the programme is
                clearly planned and documented.',
            ];
        });
    }

    public function standard2_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.11,
                'criteria_id' => 2,
                'description' => 'Programme fulfils the
                required total volume of learning
                at the relevant SLQF Level',
            ];
        });
    }

    public function standard2_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.12,
                'criteria_id' => 2,
                'description' => 'Progression opportunities
                and progression pathways upon
                successful completion of study
                programme are clearly stated in
                the prospectus.',
            ];
        });
    }

    public function standard2_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.13,
                'criteria_id' => 2,
                'description' => 'The PGPP and HEI ensure
                the name of the qualification
                awarded for the programme
                complies with the SLQF with
                respect to the Type, Designator,
                Qualifier, and the Abbreviation.',
            ];
        });
    }

    public function standard2_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.14,
                'criteria_id' => 2,
                'description' => 'Intended Learning
                Outcomes (ILOs) of each
                course/module/research, which
                include latest developments in
                the field, are clearly mapped with
                respective PLOs and SLQF Level
                Descriptors.',
            ];
        });
    }

    public function standard2_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.15,
                'criteria_id' => 2,
                'description' => 'Teaching- learning
                activities are designed to be
                student-centred, and clearly
                aligned with assessment tasks
                and ILOs for each course/module.',
            ];
        });
    }

    public function standard2_16(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.16,
                'criteria_id' => 2,
                'description' => ' Each individual
                course/module has a credit value,
                designated number of study
                hours (notional hours) which
                include any combination of direct
                teaching hours, learning
                activities, assignments, tutorials,
                laboratory/clinical work, project
                work, self-learning, use of
                library, revision and
                examinations in compliance with
                the SLQF.',
            ];
        });
    }

    public function standard2_17(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.17,
                'criteria_id' => 2,
                'description' => 'The PGPMU publishes
                programme specifications for the
                study programmes and course
                specifications for taught courses
                and research component (where
                relevant).',
            ];
        });
    }

    public function standard2_18(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.18,
                'criteria_id' => 2,
                'description' => 'The programme has the
                appropriate proportions of taught
                courses and a research
                component or guided
                independent study component, in
                compliance with the SLQF.',
            ];
        });
    }

    public function standard2_19(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.19,
                'criteria_id' => 2,
                'description' => 'The research component or
                the guided independent study
                component of the programme
                (when applicable) fulfils the
                requirements described in the
                SLQF for the respective level.',
            ];
        });
    }

    public function standard2_20(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.20,
                'criteria_id' => 2,
                'description' => 'PGPMU uses officially
                approved standard formats/
                templates/ guidelines for
                programme, course/module
                design and development and
                complies with official
                requirements during the
                programme design and
                development phases.',
            ];
        });
    }

    public function standard2_21(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.21,
                'criteria_id' => 2,
                'description' => 'The PGPMU designs study
                programmes according to an
                annual academic calendar (where
                relevant) that enables the
                students to successfully complete
                the programme at the stipulated
                time.',
            ];
        });
    }

    public function standard2_22(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.22,
                'criteria_id' => 2,
                'description' => 'Programme approval
                decisions are taken by the
                relevant institutional committee
                after full consideration of design
                principles, academic standards,
                and appropriateness of the
                learning opportunities available,
                monitoring and review
                arrangements and content of the
                programme specification.',
            ];
        });
    }

    public function standard2_23(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.23,
                'criteria_id' => 2,
                'description' => ' PGPMU uses student
                feedback for continuous
                improvement of the programme
                of study and the student
                experience.',
            ];
        });
    }

    public function standard2_24(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.24,
                'criteria_id' => 2,
                'description' => ' PGPMU collects
                information about students’
                progression after graduation and
                uses it for continuous
                improvement of the programme.',
            ];
        });
    }

    public function standard2_25(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 2.25,
                'criteria_id' => 2,
                'description' => 'PGPMU uses the results of
                programme evaluation for the
                process of curriculum revision.',
            ];
        });
    }

    //criteria 3

    public function standard3_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.1,
                'criteria_id' => 3,
                'description' => 'The PGPP and PGPMU
                have sufficient academic,
                administrative, academic
                support staff and non-academic staff for efficient
                execution of the programme
                and to maintain the academic
                quality of course delivery and
                supervision of research.',
            ];
        });
    }

    public function standard3_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.2,
                'criteria_id' => 3,
                'description' => 'The PGPMU has
                mechanisms to make sure that
                the academic staff who are
                assigned teaching or research
                supervision responsibilities
                carry out the task to
                completion within the
                stipulated time period.',
            ];
        });
    }

    public function standard3_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.3,
                'criteria_id' => 3,
                'description' => 'The PGPP ensures that
                all staff of all categories are
                informed of relevant
                institutional regulations and
                procedures including updates.',
            ];
        });
    }

    public function standard3_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.4,
                'criteria_id' => 3,
                'description' => 'The PGPP supports
                Continuous Professional
                Development and training of
                its academic, academic
                support, administrative and
                non-academic staff',
            ];
        });
    }

    public function standard3_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.5,
                'criteria_id' => 3,
                'description' => 'The PGPP has published
                pre-approved criteria to
                evaluate the performance of
                all categories of staff and a
                mechanism to regularly
                monitor their performance.',
            ];
        });
    }

    public function standard3_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.6,
                'criteria_id' => 3,
                'description' => 'The PGPP rewards
                members of staff with
                outstanding performance.',
            ];
        });
    }

    public function standard3_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.7,
                'criteria_id' => 3,
                'description' => 'The PGPP/PGPMU has
                established guidelines on PG
                student services that are
                communicated to all students.',
            ];
        });
    }

    public function standard3_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.8,
                'criteria_id' => 3,
                'description' => 'PGPP/PGPMU makes
                the guidelines on student
                services available to staff.',
            ];
        });
    }

    public function standard3_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.9,
                'criteria_id' => 3,
                'description' => 'The PGPP ensures
                adherence to guidelines and
                codes of conduct relevant to
                student services, by staff.',
            ];
        });
    }

    public function standard3_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.10,
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures
                that learning resources are up-to-date, adequate for all
                students, and support
                achievement of programme
                outcomes by all students',
            ];
        });
    }

    public function standard3_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.11,
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures
                that students are made aware
                of and trained (where
                relevant) for safe engagement
                in learning activities and
                research.',
            ];
        });
    }

    public function standard3_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.12,
                'criteria_id' => 3,
                'description' => 'The PGPP provides
                students and teachers with
                access to a library that is
                networked and has up-to-date
                titles in print or electronic
                media, Open Educational
                Resources (OER) and data
                bases that comply with laws
                pertaining to intellectual
                property rights.',
            ];
        });
    }

    public function standard3_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.13,
                'criteria_id' => 3,
                'description' => 'The library provides
                students and teachers with
                services such as interlibrary
                loans, reprography, reading
                rooms, wi-fi, electronic
                access, meeting rooms etc.',
            ];
        });
    }

    public function standard3_14(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.14,
                'criteria_id' => 3,
                'description' => 'The library provides
                students and staff with
                facilities to carry out
                plagiarism checks.',
            ];
        });
    }

    public function standard3_15(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.15,
                'criteria_id' => 3,
                'description' => 'PGPP or PGPMU
                ensures students and staff
                have access to adequate
                computer and internet
                facilities, essential up-to-date
                licensed software and friendly
                technical support.',
            ];
        });
    }

    public function standard3_16(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.16,
                'criteria_id' => 3,
                'description' => 'The PGPP ensures that
                students have access to a
                functional LMS, that is
                customized by the PGPMU
                for its programmes of study.',
            ];
        });
    }

    public function standard3_17(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.17,
                'criteria_id' => 3,
                'description' => 'The PGPMU provides
                training for staff and students
                in the use of the LMS',
            ];
        });
    }

    public function standard3_18(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.18,
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures
                access by staff and students to
                well-equipped and adequate
                physical facilities for
                teaching-learning and
                research activities, both on-site and outside of the PGPP',
            ];
        });
    }

    public function standard3_19(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.19,
                'criteria_id' => 3,
                'description' => 'The PGPP maintains
                well-equipped and adequate
                physical infrastructure for
                administrative and non-academic staff',
            ];
        });
    }

    public function standard3_20(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.20,
                'criteria_id' => 3,
                'description' => 'The PGPP ensures
                availability of adequate and
                well-maintained cafeteria and
                sanitary facilities for all
                students and staff, including
                those with special needs.',
            ];
        });
    }

    public function standard3_21(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.21,
                'criteria_id' => 3,
                'description' => 'The PGPMU ensures
                that students and staff with
                special needs have adequate
                access to facilities for
                teaching-learning and
                research',
            ];
        });
    }

    public function standard3_22(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 3.22,
                'criteria_id' => 3,
                'description' => 'The PGPP or PGPMU
                has a mentoring and
                counselling system in place to
                provide students with
                guidance and support
                throughout the programme of
                study.',
            ];
        });
    }

    //criteria 4

    public function standard4_1(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.1,
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures
                that the conducted
                programme of study is
                consistent with detailed
                programme and course
                specifications/ research
                proposal specifications.',
            ];
        });
    }

    public function standard4_2(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.2,
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures
                that teaching-learning and
                research activities are
                consistent with and
                facilitates the achievement
                of programme learning
                outcomes by all
                postgraduate students.',
            ];
        });
    }

    public function standard4_3(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.3,
                'criteria_id' => 4,
                'description' => ' The PGPMU ensures
                that all postgraduate
                programmes demand a high
                level of theoretical
                engagement through
                teaching, guided
                independent study or
                research in compliance with
                the Purpose and Scope as
                outlined in the SLQF
                requirements.',
            ];
        });
    }

    public function standard4_4(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.4,
                'criteria_id' => 4,
                'description' => 'PGPMU has
                mechanisms to ensure that
                all teachers involved in
                each graduate program are
                qualified to provide high
                level of theoretical
                knowledge or to guide
                independent study or
                research projects.',
            ];
        });
    }

    public function standard4_5(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.5,
                'criteria_id' => 4,
                'description' => 'PGPMU ensures that
                teaching-learning
                engagement time of
                students of every course
                comply with the credit
                value stated in the course
                curriculum and notional
                hours specified in the
                SLQF.',
            ];
        });
    }

    public function standard4_6(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.6,
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures
                that every course unit or
                module in a programme of
                study has a detailed course
                syllabus or plan that sets out
                the weekly schedule of
                activities that are aligned
                with the course ILOs.',
            ];
        });
    }

    public function standard4_7(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.7,
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures
                that all students are made
                aware of the specified
                course or module plan and
                the course ILOs at the
                commencement of the
                course unit or module',
            ];
        });
    }

    public function standard4_8(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.8,
                'criteria_id' => 4,
                'description' => 'The PGPMU has a
                mechanism to ensure that
                every teacher adheres to the
                specified course or module
                plan.',
            ];
        });
    }

    public function standard4_9(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.9,
                'criteria_id' => 4,
                'description' => ' The PGPMU has
                mechanisms to obtain
                feedback from peers and
                students on teaching-learning and research
                activities',
            ];
        });
    }

    public function standard4_10(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.10,
                'criteria_id' => 4,
                'description' => 'The PGPMU uses
                feedback from peers and
                students to improve the
                quality of teaching-learning
                and research activities.',
            ];
        });
    }

    public function standard4_11(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.11,
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures
                effective use of both
                electronic and online media
                as well as face-to-face
                teaching-learning activities
                in every program of study',
            ];
        });
    }

    public function standard4_12(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.12,
                'criteria_id' => 4,
                'description' => ' PGPP has
                mechanisms to ensure
                adherence to honesty,
                academic integrity, and
                ethical conduct by staff and
                students in all areas of
                teaching-learning and
                research.',
            ];
        });
    }

    public function standard4_13(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'standard_no' => 4.13,
                'criteria_id' => 4,
                'description' => 'The PGPMU ensures
                that all students are
                provided with adequate
                opportunities to develop
                their communication skills
                in English and/or Sinhala
                and/or Tamil as appropriate
                to the programme of study.',
            ];
        });
    }
}
