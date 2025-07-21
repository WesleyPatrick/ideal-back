-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('VIDEO', 'DIALOG', 'MULTIPLE_RESPONSE', 'IMAGE', 'COMPLETE_SENTENCE', 'TRUE_OR_FALSE');

-- CreateEnum
CREATE TYPE "SentencePersonIconEnum" AS ENUM ('SOLINHO', 'ANA_SECRETARIA', 'CLARA_SECRETARIA', 'PAULO_ENFERMEIRO', 'GIOVANA_ENFERMEIRA', 'JOAO', 'JOAQUIM', 'MARIA');

-- CreateEnum
CREATE TYPE "RoleValue" AS ENUM ('ADMIN', 'OPERATOR', 'SERVICE_PROVIDER', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "RoleValue" NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cnpj" TEXT,
    "responsible" TEXT,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "solecas" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operators" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disciplineId" TEXT,

    CONSTRAINT "operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_providers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "service_provider_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "communityId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_accesses" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "discipline_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "discipline_id" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "initial_video" TEXT,
    "article_file" TEXT,
    "index" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "dialog_activity_id" TEXT,
    "module_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "mission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_tests" (
    "id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "final_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests_conclusion" (
    "id" TEXT NOT NULL,
    "activities_hit" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "final_test_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tests_conclusion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_activities" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "stepPosition" INTEGER NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "step_id" TEXT NOT NULL,
    "final_test_id" TEXT,

    CONSTRAINT "video_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dialog_activities" (
    "id" TEXT NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "stepPosition" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "step_id" TEXT,
    "final_test_id" TEXT,

    CONSTRAINT "dialog_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentences" (
    "id" TEXT NOT NULL,
    "person" "SentencePersonIconEnum" NOT NULL,
    "index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "dialog_activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiple_response_activities" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "stepPosition" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "step_id" TEXT NOT NULL,
    "final_test_id" TEXT,

    CONSTRAINT "multiple_response_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "multiple_response_activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_activities" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "stepPosition" INTEGER NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "step_id" TEXT NOT NULL,
    "final_test_id" TEXT,

    CONSTRAINT "image_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_images" (
    "id" TEXT NOT NULL,
    "image_file" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "image_activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "response_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complete_sentence_activities" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "stepPosition" INTEGER NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "text_parts" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "step_id" TEXT NOT NULL,
    "final_test_id" TEXT,

    CONSTRAINT "complete_sentence_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gaps" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "options" TEXT[],
    "correct" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "true_or_false_activities" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "stepPosition" INTEGER NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "step_id" TEXT NOT NULL,
    "final_test_id" TEXT,

    CONSTRAINT "true_or_false_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "true_or_false_items" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_true" BOOLEAN NOT NULL DEFAULT false,
    "true_or_false_activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "true_or_false_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "solecas_value" INTEGER NOT NULL,
    "money_value" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "color" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prize_orders" (
    "id" TEXT NOT NULL,
    "prize_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "service_provider_id" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "solecas_value" INTEGER NOT NULL,
    "solecas_remaining" INTEGER NOT NULL,
    "money_value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prize_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "activity_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "discipline_id" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "is_daily_mission" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_access_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_module_conclusions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "user_module_conclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mission_conclusions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "user_mission_conclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_discipline_conclusions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "discipline_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "user_discipline_conclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_step_conclusions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "user_step_conclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees_communities" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_messages" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_missions" (
    "id" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "solecas_amount" INTEGER NOT NULL,
    "mission_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_missions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "daily_mission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_mission_step_conclusions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,

    CONSTRAINT "user_daily_mission_step_conclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DisciplineToOperator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DisciplineToOperator_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_cnpj_key" ON "users"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "operators_user_id_key" ON "operators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_providers_user_id_key" ON "service_providers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE INDEX "profile_accesses_discipline_id_idx" ON "profile_accesses"("discipline_id");

-- CreateIndex
CREATE INDEX "profile_accesses_module_id_idx" ON "profile_accesses"("module_id");

-- CreateIndex
CREATE INDEX "profile_accesses_mission_id_idx" ON "profile_accesses"("mission_id");

-- CreateIndex
CREATE INDEX "profile_accesses_profile_id_idx" ON "profile_accesses"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "final_tests_mission_id_key" ON "final_tests"("mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "tests_conclusion_employee_id_final_test_id_key" ON "tests_conclusion"("employee_id", "final_test_id");

-- CreateIndex
CREATE INDEX "activity_attempts_module_id_discipline_id_idx" ON "activity_attempts"("module_id", "discipline_id");

-- CreateIndex
CREATE INDEX "activity_attempts_user_id_idx" ON "activity_attempts"("user_id");

-- CreateIndex
CREATE INDEX "activity_attempts_is_correct_idx" ON "activity_attempts"("is_correct");

-- CreateIndex
CREATE UNIQUE INDEX "activity_attempts_user_id_activity_id_is_daily_mission_key" ON "activity_attempts"("user_id", "activity_id", "is_daily_mission");

-- CreateIndex
CREATE INDEX "user_access_logs_user_id_accessed_at_idx" ON "user_access_logs"("user_id", "accessed_at");

-- CreateIndex
CREATE INDEX "user_module_conclusions_user_id_module_id_idx" ON "user_module_conclusions"("user_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_module_conclusions_user_id_module_id_key" ON "user_module_conclusions"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "user_mission_conclusions_user_id_mission_id_idx" ON "user_mission_conclusions"("user_id", "mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_mission_conclusions_user_id_mission_id_key" ON "user_mission_conclusions"("user_id", "mission_id");

-- CreateIndex
CREATE INDEX "user_discipline_conclusions_user_id_idx" ON "user_discipline_conclusions"("user_id");

-- CreateIndex
CREATE INDEX "user_discipline_conclusions_discipline_id_idx" ON "user_discipline_conclusions"("discipline_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_discipline_conclusions_user_id_discipline_id_key" ON "user_discipline_conclusions"("user_id", "discipline_id");

-- CreateIndex
CREATE INDEX "user_step_conclusions_user_id_idx" ON "user_step_conclusions"("user_id");

-- CreateIndex
CREATE INDEX "user_step_conclusions_step_id_idx" ON "user_step_conclusions"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_step_conclusions_user_id_step_id_key" ON "user_step_conclusions"("user_id", "step_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_communities_employee_id_community_id_key" ON "employees_communities"("employee_id", "community_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_missions_user_id_daily_mission_id_key" ON "user_daily_missions"("user_id", "daily_mission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_mission_step_conclusions_user_id_step_id_key" ON "user_daily_mission_step_conclusions"("user_id", "step_id");

-- CreateIndex
CREATE INDEX "_DisciplineToOperator_B_index" ON "_DisciplineToOperator"("B");

-- AddForeignKey
ALTER TABLE "operators" ADD CONSTRAINT "operators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_accesses" ADD CONSTRAINT "profile_accesses_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_accesses" ADD CONSTRAINT "profile_accesses_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_accesses" ADD CONSTRAINT "profile_accesses_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_accesses" ADD CONSTRAINT "profile_accesses_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_accesses" ADD CONSTRAINT "profile_accesses_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_dialog_activity_id_fkey" FOREIGN KEY ("dialog_activity_id") REFERENCES "dialog_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_tests" ADD CONSTRAINT "final_tests_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests_conclusion" ADD CONSTRAINT "tests_conclusion_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests_conclusion" ADD CONSTRAINT "tests_conclusion_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_activities" ADD CONSTRAINT "video_activities_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_activities" ADD CONSTRAINT "video_activities_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dialog_activities" ADD CONSTRAINT "dialog_activities_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dialog_activities" ADD CONSTRAINT "dialog_activities_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_dialog_activity_id_fkey" FOREIGN KEY ("dialog_activity_id") REFERENCES "dialog_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_response_activities" ADD CONSTRAINT "multiple_response_activities_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_response_activities" ADD CONSTRAINT "multiple_response_activities_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_multiple_response_activity_id_fkey" FOREIGN KEY ("multiple_response_activity_id") REFERENCES "multiple_response_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_activities" ADD CONSTRAINT "image_activities_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_activities" ADD CONSTRAINT "image_activities_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_images" ADD CONSTRAINT "response_images_image_activity_id_fkey" FOREIGN KEY ("image_activity_id") REFERENCES "image_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complete_sentence_activities" ADD CONSTRAINT "complete_sentence_activities_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complete_sentence_activities" ADD CONSTRAINT "complete_sentence_activities_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gaps" ADD CONSTRAINT "gaps_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "complete_sentence_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "true_or_false_activities" ADD CONSTRAINT "true_or_false_activities_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "true_or_false_activities" ADD CONSTRAINT "true_or_false_activities_final_test_id_fkey" FOREIGN KEY ("final_test_id") REFERENCES "final_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "true_or_false_items" ADD CONSTRAINT "true_or_false_items_true_or_false_activity_id_fkey" FOREIGN KEY ("true_or_false_activity_id") REFERENCES "true_or_false_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prize_orders" ADD CONSTRAINT "prize_orders_prize_id_fkey" FOREIGN KEY ("prize_id") REFERENCES "prizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prize_orders" ADD CONSTRAINT "prize_orders_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prize_orders" ADD CONSTRAINT "prize_orders_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prize_orders" ADD CONSTRAINT "prize_orders_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attempts" ADD CONSTRAINT "activity_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attempts" ADD CONSTRAINT "activity_attempts_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attempts" ADD CONSTRAINT "activity_attempts_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attempts" ADD CONSTRAINT "activity_attempts_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_attempts" ADD CONSTRAINT "activity_attempts_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_access_logs" ADD CONSTRAINT "user_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_conclusions" ADD CONSTRAINT "user_module_conclusions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_conclusions" ADD CONSTRAINT "user_module_conclusions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mission_conclusions" ADD CONSTRAINT "user_mission_conclusions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mission_conclusions" ADD CONSTRAINT "user_mission_conclusions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_discipline_conclusions" ADD CONSTRAINT "user_discipline_conclusions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_discipline_conclusions" ADD CONSTRAINT "user_discipline_conclusions_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_step_conclusions" ADD CONSTRAINT "user_step_conclusions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_step_conclusions" ADD CONSTRAINT "user_step_conclusions_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees_communities" ADD CONSTRAINT "employees_communities_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees_communities" ADD CONSTRAINT "employees_communities_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_messages" ADD CONSTRAINT "community_messages_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_messages" ADD CONSTRAINT "community_messages_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_missions" ADD CONSTRAINT "daily_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_missions" ADD CONSTRAINT "daily_missions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_missions" ADD CONSTRAINT "user_daily_missions_daily_mission_id_fkey" FOREIGN KEY ("daily_mission_id") REFERENCES "daily_missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_missions" ADD CONSTRAINT "user_daily_missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_mission_step_conclusions" ADD CONSTRAINT "user_daily_mission_step_conclusions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_mission_step_conclusions" ADD CONSTRAINT "user_daily_mission_step_conclusions_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineToOperator" ADD CONSTRAINT "_DisciplineToOperator_A_fkey" FOREIGN KEY ("A") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineToOperator" ADD CONSTRAINT "_DisciplineToOperator_B_fkey" FOREIGN KEY ("B") REFERENCES "operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
