import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import { getByLabelText } from "@testing-library/react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const MasterLayout = lazy(() => import("./masterLayout/MasterLayout"));

//importing admission module
const ClassPage = lazy(() => import("./pages/ClassPage"));
const AcademicYearPage = lazy(() => import("./pages/AcademicYearPage"));
const DivisionPage = lazy(() => import("./pages/DivisionPage"));
const CastPage = lazy(() => import("./pages/CastMasterPage"));
const EmployeePage = lazy(() => import("./pages/EmployeePage"));
const RolePage = lazy(() => import("./pages/RolePage"));
const PhisallyDisablePage = lazy(() => import("./pages/PyisallyDisablePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const StagePage = lazy(() => import("./pages/stagePage"));
const FiledTypePage = lazy(() => import("./pages/FieldTypePae"));
const AllFiledPage = lazy(() => import("./pages/AllFieldPage"));
const OptionValuePage = lazy(() => import("./pages/OptionValuePage"));

const AdminDashBoardPage=lazy(()=>
import("./pages/AdminPages/AdminDashBoardPage")
);
const PersonalInformationForm = lazy(() =>
  import("./components/child/PersonalInformationForm")
);
const SubjectPage = lazy(() =>
  import("./pages/AdminPages/SubjectMaster/subjectPage")
);
const AssignSubjectPage = lazy(() =>
  import("./pages/AdminPages/SubjectMaster/AssignSubjectPage")
);
const AddDocumentPage = lazy(() =>
  import("./pages/AdminPages/master/documentMaster/addDocumentPage")
);
const AssignDocumentPage = lazy(() =>
  import("./pages/AdminPages/master/documentMaster/assignDocumentPage")
);
const ProgramPage = lazy(() =>
  import("./pages/AdminPages/SubjectMaster/ProgramPage")
);
const DeclarationStatement = lazy(() =>
  import("./components/child/master/Declaration/DeclarationStatement")
);
const InstitutePage = lazy(() =>
  import("./pages/AdminPages/setting/InstitutePage")
);
const Registration = lazy(() => import("./components/child/Registration"));
const SubjectStage = lazy(() => import("./components/child/SubjectStage"));
const AddmissionConformPage = lazy(() =>
  import("./pages/AdminPages/admissionMaster/AddmissionConformPage")
);
const SeatAllotmentPage = lazy(() =>
  import("./pages/AdminPages/admissionMaster/SeatAllotmentPage")
);
const StudentPage = lazy(() =>
  import("./pages/AdminPages/academic/StudentPage")
);
const StudentBulkUpdatePage=lazy(()=>
import("./pages/AdminPages/academic/StudentBulkUpdatePage")
);
const DocumentStage = lazy(() => import("./components/child/DocumentStage"));
const DeclarationStage = lazy(() =>
  import("./components/child/DeclarationStage")
);
const ParentParticularStage = lazy(() =>
  import("./components/child/ParentParticularStage")
);
const EducationalDetailStage = lazy(() =>
  import("./components/child/EducationalDetailStage")
);
const TransportDetailStage = lazy(() =>
  import("./components/child/TransportDetailStage")
);
const OtherInformationStage = lazy(() =>
  import("./components/child/OtherInformationStage")
);
const RoutePage = lazy(() => import("./pages/AdminPages/transport/RoutePage"));
const SubRoutePage = lazy(() =>
  import("./pages/AdminPages/transport/SubRoutePage")
);
const CompletedStage = lazy(() => import("./components/child/CompletedStage"));
const ClassFiledPage = lazy(() => import("./pages/ClassFieldPage"));
const StudentLayout = lazy(() => import("./studentLayout/StudentLayout"));
const StudentDashboard = lazy(() =>
  import("./pages/studentPages/StudentDashboardPage")
);
const StudentFee=lazy(()=>
  import("./components/child/student/StudentFee")
);
const ClasswiseSchoolPage = lazy(() =>
  import("./pages/AdminPages/classwiseSchool/classwiseSchoolPage")
);
const AllStageShown = lazy(() =>
  import("./components/child/admissionMaster.jsx/AllStageShown")
);
const StudentAdmissionStatus = lazy(() =>
  import("./components/child/student/StudentAdmissionStatus")
);

const AddmissionFormStatusReport = lazy(() =>
  import("./pages/AdminPages/admissionMaster/AddmissionFormStatusReport")
);
const AddmissionFormAcceptReport = lazy(() =>
  import("./pages/AdminPages/admissionMaster/AdmissionFormAcceptReport")
);
const DownloadStudentDataPage = lazy(() =>
  import("./pages/AdminPages/admissionMaster/DownloadStudentDataPage")
);
//end admission module importing here

//importing fee module

const AddBankPage = lazy(() =>
  import("./pages/AdminPages/feeMaster/AddBankPage")
);
const BankDetailPage = lazy(() =>
  import("./pages/AdminPages/feeMaster/BankDetailPage")
);

const FeeGroupPage = lazy(() =>
  import("./pages/AdminPages/feeMaster/FeeGroupPage")
);
const FeeHeadPage = lazy(() =>
  import("./pages/AdminPages/feeMaster/feeHeadPage")
);
const FinePage = lazy(() =>
  import("./pages/AdminPages/feeMaster/FinePage")
);
const AssignedFinedPage=lazy(()=>
import("./pages/AdminPages/feeMaster/AssignedFinedPage")
);

const FeeSplitPage=lazy(()=>
import("./pages/AdminPages/feeMaster/FeeSplitPage")
);

const FeeGroupPricingPage = lazy(() =>
  import("./pages/AdminPages/feeMaster/FeeGroupPricingPage")
);

const AcacademicOnlineFeeReportPage = lazy(() =>
  import("./pages/AdminPages/academifee/AcacademicOnlineFeeReportPage")
);

const AcacademicOfflineFeeReportPage = lazy(() =>
  import("./pages/AdminPages/academifee/AcadmicOfflinePaymentReport")
);
const AcademicUnpaidAndPaidReportPage = lazy(() =>
  import("./pages/AdminPages/academifee/AcademicUnpaidAndPaidReportPage")
);
const AcademicSummaryFeeReportPage = lazy(() =>
  import("./pages/AdminPages/academifee/AcademicSummaryFeeReportPage")
);
const AcademicAllFeeTransactionPage=lazy(() =>
  import("./pages/AdminPages/academifee/AcademicAllFeeTransactionPage")
);
const AcademicFeeCollectPage = lazy(() =>
  import("./pages/AdminPages/academifee/AcademicFeeCollectPage")
);


const DownLoadRecieptPage=lazy(()=>
import("./pages/AdminPages/academifee/DownLoadRecieptPage")
);

const AdmissionOnlineFeeReportPage = lazy(() =>
  import("./pages/AdminPages/admissionfee/AcacademicOnlineFeeReportPage")
);
const AdmissionOfflinePaymentReportPage = lazy(() =>
  import("./pages/AdminPages/admissionfee/AcadmicOfflinePaymentReport")
);
const AdmissionUnpaidAndPaidReportPage = lazy(() =>
  import("./pages/AdminPages/admissionfee/AcademicUnpaidAndPaidReportPage")
);
const AdmissionAllFeeTransactionPage = lazy(() =>
  import("./pages/AdminPages/admissionfee/AdmissionAllFeeTransactionPage")
);

const TransportOnlineFeeReportPage = lazy(() =>
  import("./pages/AdminPages/transportfee/TransportOnlineFeeReportPage")
);
const TransportOfflinePaymentReportPage = lazy(() =>
  import("./pages/AdminPages/transportfee/TransportOfflinePaymentReport")
);
const TransportUnpaidAndPaidReportPage = lazy(() =>
  import("./pages/AdminPages/transportfee/TransportUnpaidAndPaidReportPage")
);
const TransportAllFeeTransactionPage=lazy(() =>
  import("./pages/AdminPages/transportfee/TransportAllFeeTransactionPage")
);
const CanteenOfflinePaymentReportPage = lazy(() =>
  import("./pages/AdminPages/canteenfee/CanteenOfflinePaymentReport")
);
const CanteenOnlineFeeReportPage = lazy(() =>
  import("./pages/AdminPages/canteenfee/CanteenOnlineFeeReportPage")
);
const CanteenUnpaidAndPaidReportPage = lazy(() =>
  import("./pages/AdminPages/canteenfee/CanteenUnpaidAndPaidReportPage")
);
const CanteenAllFeeTransactionPage=lazy(() =>
  import("./pages/AdminPages/canteenfee/CanteenAllFeeTransactionPage")
);

const AcademicFinePage=lazy(()=>import("./pages/AdminPages/academifee/AcademicFinePage"))
const ErrorPage=lazy(()=>import("./pages/AdminPages/error/ErrorPage"))

const routeFallback = (
  <div className="d-flex justify-content-center align-items-center p-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  let user =true;
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Suspense fallback={routeFallback}>
        <Routes>
          <Route>
            <Route
              path="/"
              element={
                !user ? <Navigate to="/dashboard" replace /> : <LoginPage />
              }
            />
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/personal-information"
              element={<PersonalInformationForm />}
            />
            <Route
              path="/educational-detail-stage"
              element={<EducationalDetailStage />}
            />
            <Route path="/subject-stage" element={<SubjectStage />} />
            <Route
              path="/parent-particular-stage"
              element={<ParentParticularStage />}
            />
            <Route
              path="/transport-detail-stage"
              element={<TransportDetailStage />}
            />
            <Route
              path="/other-information-stage"
              element={<OtherInformationStage />}
            />
            <Route path="/declaration-stage" element={<DeclarationStage />} />
            <Route path="/document-stage" element={<DocumentStage />} />
            <Route path="/complete-stage" element={<CompletedStage />} />
            <Route path="dashboard" element={<MasterLayout />}>
              {/*admin route*/}
              <Route index element={<AdminDashBoardPage />} />
              <Route path="employee-master" element={<EmployeePage />} />
              <Route path="class-master" element={<ClassPage />} />
              <Route path="academic-year-master" element={<AcademicYearPage />} />
              <Route path="division-master" element={<DivisionPage />} />
              <Route path="cast-master" element={<CastPage />} />
              <Route path="role-master" element={<RolePage />} />
              <Route path="add-declaration" element={<DeclarationStatement />} />
              <Route path="phisally-disable" element={<PhisallyDisablePage />} />
              <Route
                path="admission-form-master/stages"
                element={<StagePage />}
              />
              <Route
                path="admission-form-master/filed-type"
                element={<FiledTypePage />}
              />
              <Route
                path="admission-form-master/stages"
                element={<StagePage />}
              />
              <Route
                path="admission-form-master/Field"
                element={<AllFiledPage />}
              />
              <Route
                path="admission-form-master/field-values"
                element={<OptionValuePage />}
              />
              <Route
                path="admission-form-master/class-field"
                element={<ClassFiledPage />}
              />
              <Route path="subject" element={<SubjectPage />} />
              <Route path="assign-subject" element={<AssignSubjectPage />} />
              <Route path="program" element={<ProgramPage />} />
              <Route
                path="document-master/add-document"
                element={<AddDocumentPage />}
              />
              <Route
                path="document-master/assign-document"
                element={<AssignDocumentPage />}
              />
              <Route path="setting">
                <Route path="institute" element={<InstitutePage />} />
              </Route>
              <Route path="admission">
                <Route path="form-conform" element={<AddmissionConformPage />} />
                <Route path="seat-allotment" element={<SeatAllotmentPage />} />
                <Route path="view-accept" element={<AllStageShown />} />
                <Route path="student-data" element={<DownloadStudentDataPage />} />
                <Route
                  path="online-admission-payment"
                  element={<AdmissionOnlineFeeReportPage />}
                />
                <Route
                  path="offline-admission-payment"
                  element={<AdmissionOfflinePaymentReportPage />}
                />
                <Route
                  path="all-transaction-admission-payment"
                  element={<AdmissionAllFeeTransactionPage />}
                />
              </Route>

              <Route path="admission-report">
                <Route
                  path="form-status-report"
                  element={<AddmissionFormStatusReport />}
                />
                <Route
                  path="form-accept-report"
                  element={<AddmissionFormAcceptReport />}
                />
              </Route>

              <Route path="academic">
                <Route path="student" element={<StudentPage />} />
                <Route path="student-detail-bulk-update" element={<StudentBulkUpdatePage />} />
              </Route>

              <Route path="bus-fee">
                <Route
                  path="online-bus-payment"
                  element={<TransportOnlineFeeReportPage />}
                />
                <Route
                  path="offline-bus-payment"
                  element={<TransportOfflinePaymentReportPage />}
                />
                <Route
                  path="paid-and-unpaid-report"
                  element={<TransportUnpaidAndPaidReportPage />}
                />
                <Route
                  path="all-transaction-bus-payment"
                  element={<TransportAllFeeTransactionPage />}
                />
              </Route>

              <Route path="academic-fee">
                <Route
                  path="online-academic-payment"
                  element={<AcacademicOnlineFeeReportPage />}
                />
                <Route
                  path="offline-academic-payment"
                  element={<AcacademicOfflineFeeReportPage />}
                />

                <Route
                  path="paid-and-unpaid-report"
                  element={<AcademicUnpaidAndPaidReportPage />}
                />
                <Route
                  path="fees-summary-academic-report"
                  element={<AcademicSummaryFeeReportPage />}
                />
                <Route
                  path="all-transaction-academic-payment"
                  element={<AcademicAllFeeTransactionPage />}
                />
                <Route path="academic-fine" element={<AcademicFinePage />} />
                <Route
                path="download-student-bulk-reciept"
                element={<DownLoadRecieptPage/>}
                />

                <Route path="collect-academic-fee" element={<AcademicFeeCollectPage />} />
              </Route>
              <Route path="canteen-fee">
                <Route
                  path="online-canteen-payment"
                  element={<CanteenOnlineFeeReportPage />}
                />
                <Route
                  path="offline-canteen-payment"
                  element={<CanteenOfflinePaymentReportPage />}
                />
                <Route
                  path="paid-and-unpaid-report"
                  element={<CanteenUnpaidAndPaidReportPage />}
                />
                <Route
                  path="all-transaction-canteen-payment"
                  element={<CanteenAllFeeTransactionPage />}
                />
              </Route>
              <Route path="transport">
                <Route path="add-route" element={<RoutePage />} />
                <Route path="assign-sub-route" element={<SubRoutePage />} />
              </Route>
              <Route path="class-wise-school" element={<ClasswiseSchoolPage />} />

              <Route path="accounts">
                <Route path="fee-master">
                  <Route path="add-bank" element={<AddBankPage />} />
                  <Route path="add-bank-detail" element={<BankDetailPage />} />
                  <Route path="add-fee-head" element={<FeeHeadPage />} />
                  <Route path="add-fee-group" element={<FeeGroupPage />} />
                  <Route path="fee-group-pricing" element={<FeeGroupPricingPage />} />
                  <Route path='fine' element={<FinePage/>}/>
                  <Route path='assigned-fine' element={<AssignedFinedPage/>}/>
                  <Route path='online-fee-breakup' element={<FeeSplitPage/>}/>
                </Route>
              </Route>

              <Route path="error-logs" element={<ErrorPage />} />

              {/*admin route end*/}
            </Route>

            {/*student route start*/}

            <Route path="studentdashboard" element={<StudentLayout />}>
              {/*admin route*/}
              <Route index element={<StudentDashboard />} />
              <Route
                path="admission-accept-status"
                element={<StudentAdmissionStatus />}
              />
              <Route
                path="dues-fees"
                element={<StudentFee />}
              />
             

              {/* student  route end*/}
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
