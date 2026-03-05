"use client";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { createSubject, updateSubject } from "@/app/admin/subjects/actions";

type Subject = {
  id: string;
  name: string;
  code: string;
  description: string | null;
};

type Props =
  | {
      inline: true;
      open?: never;
      onClose?: never;
      subject?: never;
    }
  | {
      inline?: false;
      open: boolean;
      onClose: () => void;
      subject: Subject | null;
    };

export default function SubjectModal(props: Props) {
  const isControlled = "open" in props;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? props.open : internalOpen;
  const onClose = isControlled ? props.onClose : () => setInternalOpen(false);
  const subject = isControlled ? props.subject : null;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const isEdit = useMemo(() => !!subject?.id, [subject]);

  useEffect(() => {
    if (subject) {
      setName(subject.name ?? "");
      setCode(subject.code ?? "");
      setDescription(subject.description ?? "");
    } else {
      setName("");
      setCode("");
      setDescription("");
    }
  }, [subject, open]);

  return (
    <>
      {!isControlled && (
        <button
          onClick={() => setInternalOpen(true)}
          className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Add Subject
        </button>
      )}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md transform rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 ease-out will-change-transform ${
            open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
        >
          <h3 className="text-base font-semibold text-slate-900">
            {isEdit ? "Edit Subject" : "Add Subject"}
          </h3>
          <form
            action={async () => {
              if (isEdit && subject) {
                const fd = new FormData();
                fd.set("name", name);
                fd.set("code", code);
                fd.set("description", description);
                const result = await updateSubject(subject.id, fd);
                if (result && (result as any).success === false) {
                  await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: (result as any).message ?? "An error occurred",
                  });
                  return;
                }
                await Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "Subject updated successfully",
                  timer: 1500,
                  showConfirmButton: false,
                });
                onClose?.();
                return;
              }
              const fd = new FormData();
              fd.set("name", name);
              fd.set("code", code);
              fd.set("description", description);
              const result = await createSubject(fd);
              if (result && (result as any).success === false) {
                await Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: (result as any).message ?? "An error occurred",
                });
                return;
              }
              await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Subject created successfully",
                timer: 1500,
                showConfirmButton: false,
              });
              onClose?.();
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Name</label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Subject name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Code</label>
              <input
                name="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                placeholder="e.g., MATH101"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-800">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {isEdit ? "Save Changes" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
