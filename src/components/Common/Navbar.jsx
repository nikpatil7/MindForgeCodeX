import React, { useEffect, useState } from "react";
// import logo from "../../assets/Logo/Logo-Full-Light.png";
import logoMF from "../../assets/Logo/mindForgeLOGO-Photoroom.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCart2 } from "react-icons/bs";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { BsChevronDown } from "react-icons/bs";




const Navbar = () => {
  // const {token} = useSelector((state) => state.auth);

  // const {user} = useSelector((state) => state.profile);
  // const {totalItems} = useSelector((state) => state.cart);
  // Safe access with optional chaining

  const token = useSelector((state) => state.auth?.token);
  // const user = useSelector((state) => state.profile?.user);
  const user = useSelector((state) => state.auth?.user);
  const totalItems = useSelector((state) => state.cart?.totalItems) || 0;
  
  // console.log("Navbar state:", { token, user, totalItems });
  const location = useLocation(); //react hook

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSublinks = async () => {
    setLoading(true)
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.data) {
        setSubLinks(result.data.data);
      }
    } catch (error) {
      console.error("Could not fetch the category list:", error);
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* image */}
        <Link to="/">
          <img src={logoMF} width={160} height={42} loading="lazy" alt="logo" />
        </Link>

        {/* nav links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {
                  link.title === "Courses" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      
                      <BsChevronDown />

                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">

                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">

                        </div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (subLinks && subLinks.length >0) ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  key={i}
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login, signup,dashboard */}
        <div className="flex gap-x-4 items-center  ">
          
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
            <BsCart2 className="text-2xl text-richblack-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-xs text-red font-bold shadow-lg ring-2 ring-yellow-500">
                {totalItems}
              </span>
            )}
          </Link>
          
          
            
          )}

          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 px-[12px] py-[8px] text-richblack-100 rounded-md ">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 px-[12px] py-[8px] text-richblack-100 rounded-md ">
                Sign up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropDown />}
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// import React from "react";
// import logo from "../../assets/Logo/Logo-Full-Light.png";
// import { Link, matchPath } from "react-router-dom";
// import { NavbarLinks } from "../../data/navbar-links";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { BsCart2 } from "react-icons/bs";
// import ProfileDropDown from "../core/Auth/ProfileDropDown";
// import { BsChevronDown } from "react-icons/bs";

// const Navbar = () => {
//   const token = useSelector((state) => state.auth?.token);
//   const user = useSelector((state) => state.auth?.user);
//   const totalItems = useSelector((state) => state.cart?.totalItems) || 0;
//   const location = useLocation();

//   // Static subLinks array
//   const subLinks = [
//     { name: "Web Development", Course: ["Frontend", "Backend", "Full Stack"] },
//     { name: "Data Science", Course: ["Python", "Machine Learning", "AI"] },
//     { name: "Mobile Development", Course: ["Android", "iOS", "Flutter"] },
//     { name: "Design", Course: ["UI/UX", "Graphic Design", "3D Modeling"] },
//     { name: "Business", Course: ["Finance", "Marketing", "Management"] },
//   ];

//   const matchRoute = (route) => {
//     return matchPath({ path: route }, location.pathname);
//   };

//   return (
//     <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
//       <div className="flex w-11/12 max-w-maxContent items-center justify-between">
//         {/* image */}
//         <Link to="/">
//           <img src={logo} width={160} height={42} loading="lazy" alt="logo" />
//         </Link>

//         {/* nav links */}
//         <nav>
//           <ul className="flex gap-x-6 text-richblack-25">
//             {NavbarLinks.map((link, index) => (
//               <li key={index}>
//                 {link.title === "Catalog" ? (
//                   <>
//                     <div
//                       className={`group relative flex cursor-pointer items-center gap-1 ${
//                         matchRoute("/catalog/:catalogName")
//                           ? "text-yellow-25"
//                           : "text-richblack-25"
//                       }`}
//                     >
//                       <p>{link.title}</p>
//                       <BsChevronDown />

//                       <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
//                         <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
//                         {subLinks.length > 0 ? (
//                           <>
//                             {subLinks.map((subLink, i) => (
//                               <Link
//                                 key={i}
//                                 to={`/catalog/${subLink.name
//                                   .split(" ")
//                                   .join("-")
//                                   .toLowerCase()}`}
//                                 className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
//                               >
//                                 <p>{subLink.name}</p>
//                               </Link>
//                             ))}
//                           </>
//                         ) : (
//                           <p className="text-center">No Courses Found</p>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <Link to={link?.path}>
//                     <p
//                       className={`${
//                         matchRoute(link?.path)
//                           ? "text-yellow-25"
//                           : "text-richblack-25"
//                       }`}
//                     >
//                       {link.title}
//                     </p>
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* login, signup,dashboard */}
//         <div className="flex gap-x-4 items-center">
//           {user && user?.accountType !== "Instructor" && (
//             <Link to="/dashboard/cart" className="relative">
//               <BsCart2 className="text-2xl text-richblack-25" />
//               {totalItems > 0 && <span>{totalItems}</span>}
//             </Link>
//           )}

//           {token === null && (
//             <Link to="/login">
//               <button className="border border-richblack-700 px-[12px] py-[8px] text-richblack-100 rounded-md">
//                 Log in
//               </button>
//             </Link>
//           )}
//           {token === null && (
//             <Link to="/signup">
//               <button className="border border-richblack-700 px-[12px] py-[8px] text-richblack-100 rounded-md">
//                 Sign up
//               </button>
//             </Link>
//           )}

//           {token !== null && <ProfileDropDown />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
